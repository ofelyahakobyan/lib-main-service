import Joi from "joi";
import HttpError from "http-errors";
import _ from "lodash";

const validate = (schema) => (req, res, next) => {
  try {
    // THIS PART OF CODE TRIMS WHITESPACES FROM BODY ALL FIELDS //
    // if(!_.isEmpty(req.body)){
    //   Object.entries(req.body).map(e=>req.body[e[0]]=e[1].trim());
    // }
    const { value, error } = Joi.object(schema)
      .unknown()
      .validate(req, {
        abortEarly: false,
        label: "key",
        convert: true,
        errors: { wrap: { label: "" } },
      });
    if (error) {
      const errorDetails = {};
      error.details?.forEach((d) => {
        errorDetails[`${d.context.key}`] = d.message.replace(
          `${d.context.label}`,
          `${d.context.key}`,
        );
      });
      throw HttpError(422, { errors: errorDetails });
    }
    next();
  } catch (er) {
    next(er);
  }
};
export default validate;
