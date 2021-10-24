import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  // We pass the code we got in the body, as the server will get the code and give us the accessToken, refreshToken and expiresIn variables
  useEffect(() => {
    axios
      .post("http://localhost:7000/login", {
        code,
      })
      .then((res) => {
        window.history.pushState({}, null, "/search"); // Remove the code parameter from the url and put search instead
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
      })
      .catch((err) => {
        console.log("error 2");
        window.location = "/";
      });
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const timeout = setInterval(() => {
      axios
        .post("http://localhost:7000/refresh", {
          refreshToken,
        })
        .then((res) => {
          console.log(res.data);
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch((err) => {
          console.log("error 1");
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000);
    return () => clearInterval(timeout);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
