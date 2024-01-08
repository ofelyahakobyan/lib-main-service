import xlsx from 'xlsx';
import ServiceBooks from "../grpcClients/serviceBooks";
import path from 'path';
class TestController {
  static add = async (req, res, next) => {
    try {
      if(!req.file){
        return next();
      }

      const workbook = xlsx.readFile(req.fileName);

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const sheets = xlsx.utils.sheet_to_json(sheet)
        .map((s) =>{
        return {
          ...s, categories:s['categories'].split(',').map(i=>+i)
        }});
      const data = await ServiceBooks('addSheet', {sheets});
     res.json({
      status:'success'
     })

     } catch (e) {
      next(e)
     }
  }

  static export = async (req, res, next) => {
    try {

       const data = await ServiceBooks('exportToSheet', req.params );
       const workbook = xlsx.utils.book_new();
       const worksheet = xlsx.utils.json_to_sheet(data.sheets, {skipHeader: false } );
       xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

       const excelFilePath = path.join(path.resolve(), '/src', 'out.xlsx');
       const buffer = xlsx.write(workbook, {
         type: 'buffer',
         bookType: 'xlsx'
       });
       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
       res.setHeader('Content-Disposition', 'attachment; filename=out.xlsx');
       res.send(buffer);
       // res.sendFile(excelFilePath)
       // res.json({
       //   ...data
       // })
    } catch (e) {
      next(e)
    }
  }

}

export default TestController;