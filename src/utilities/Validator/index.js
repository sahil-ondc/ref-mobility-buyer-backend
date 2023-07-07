import * as yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const loginSchema = yup.object().shape({
  email: yup.string().required('Please Enter Email'),
  password: yup.string().required('Please Enter Password'),
});
