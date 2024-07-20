import axios from "axios";

// Step-1: Create a new Axios instance with a custom config.
// The timeout is set to 10s. If the request takes longer than
// that then the request will be aborted.
const PRODUCTION_BASE_URL =
  "https://dp-assessment-q2cqtlcudq-el.a.run.app/api/v1/";
// const DEVELOPMENT_BASE_URL = "http://localhost:8000/api/v1/";

const customAxios = axios.create({
  baseURL: PRODUCTION_BASE_URL
});

// Step-2: Create request, response & error handlers
const requestHandler = (request) => {
  const config = {
    Authorization: "Bearer " + localStorage.getItem("token"),
  };

  // Token will be dynamic so we can use any app-specific way to always
  // fetch the new token before making the call
  request.headers = config;
  return request;
};

// // Step-3: Configure/make use of request & response interceptors from Axios
// // Note: You can create one method say configureInterceptors, add below in that,
// // export and call it in an init function of the application/page.
customAxios.interceptors.request.use((request) => requestHandler(request));

export default customAxios;
