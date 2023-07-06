import jwt from 'jsonwebtoken';

// eslint-disable-next-line consistent-return
function authenticate(request, response, next) {
  // get token from header
  const token = request.header('token');
  if (!token) {
    return response
      .status(401)
      .json({ msg: 'No Token , authorization denied' });
  }

  // verify the token
  try {
    if (process.env.JWT_SECRET_KEY) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      request.user = decoded.user;
      next();
    }
  } catch (error) {
    response.status(401).json({ msg: 'Token is not valid' });
  }
}

export default authenticate;
