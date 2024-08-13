import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import { StateProps } from "../models/stateProps";

const url = "http://localhost:/api/kisd/stock/stockholds";

const useGetHoldingStock = () => {
  const isLogin = useSelector((state: StateProps) => state.login);

  const { data, isLoading, isError } = useQuery("holdingStock", getHoldingStock, {
    enabled: isLogin === 1,
  });
  return { holdingStockData: data, holdingStockLoading: isLoading, holdingStockError: isError };
};

export default useGetHoldingStock;

const getHoldingStock = async () => {
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjVmNDY1NjExLWNlZjctNGYxZi05ZjY1LWMxYjU4NTY1N2IyZiIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTcyMDU1NDMwNSwiaWF0IjoxNzIwNDY3OTA1LCJqdGkiOiJQU29BMXNIeHlYYWFEbDc4OFk0eUZWM3JsQzlhc2dFWFl0eEkifQ.0T_MKV8jRou576TiZzCmVOtnp2XkLyWacnSfe8FtUcN_k4Znz9mNv6gWUQEaskMbgg6RbdbGMhIQmNeqXKBR-w";
  // const accessToken = localStorage.getItem("accessToken");
  const options = {
    headers: {
      Authorization: `${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.get(url, options);
  const holdingStock = await response.data;
  return holdingStock;
};
