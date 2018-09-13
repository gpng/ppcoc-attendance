import axios from 'axios';

export default class AxiosRequest {
  constructor(cancelToken) {
    this.refreshToken(cancelToken);
  }

  getCancelToken() {
    return this.cancelToken.token;
  }

  cancel() {
    this.cancelToken.cancel();
  }

  refreshToken(cancelToken) {
    this.cancelToken = cancelToken || axios.CancelToken.source();
  }
}
