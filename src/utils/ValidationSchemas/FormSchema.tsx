import * as yup from "yup";

const FormSchema = yup.object().shape({
  taskName: yup.string().required("Task name is required"),
});

export { FormSchema };
