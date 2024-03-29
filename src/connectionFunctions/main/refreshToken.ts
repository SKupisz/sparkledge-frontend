/* 
    The refreshToken function refreshes user's token
*/

import axios from "axios";

const refreshToken = async (
  userRefreshToken: string, 
  changeAccessToken: (newToken: string | undefined) => void,
  changeRefreshToken: (newToken: string | undefined) => void,
) => {
  // console.log(userRefreshToken);
  await axios.post(`${process.env.REACT_APP_CONNECTION_TO_SERVER}/users/refresh`, {}, {
    headers: {
      Authorization: `Bearer ${userRefreshToken}`,
    },
  })
    .then((res) => {
      changeRefreshToken(res.data.refreshToken);
      changeAccessToken(res.data.accessToken);
    })
    .catch((err) => {
      changeAccessToken(undefined);
      changeRefreshToken(undefined);
    });
};

export default refreshToken;
