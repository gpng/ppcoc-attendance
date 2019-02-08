import axios from 'axios';
import to from 'await-to-js';

// components
import AxiosRequest from './AxiosRequest';
import auth0Client from '../components/Auth';

// constants
import { API_HOST } from '../configs/client';

export class PostAttendance extends AxiosRequest {
  async call(ids, reason) {
    this.refreshToken();
    const uri = `${API_HOST}/attendance`;
    const [err, res] = await to(axios.post(uri, { ids, reason }));
    if (!err && res.status === 200) {
      return [null, res.data];
    }
    return [err || 'server error', null];
  }
}

export class GetAutocomplete extends AxiosRequest {
  async call(query) {
    this.refreshToken();
    const uri = `${API_HOST}/search`;
    const [err, res] = await to(
      axios.get(uri, {
        params: {
          query,
        },
        cancelToken: this.getCancelToken(),
      }),
    );
    if (!err && res.status === 200) {
      return [null, res.data];
    }
    return [err || 'server error', null];
  }
}

export class GetReport extends AxiosRequest {
  async call(date) {
    this.refreshToken();
    const uri = `${API_HOST}/report`;
    const [err, res] = await to(
      axios.get(uri, {
        cancelToken: this.getCancelToken(),
        headers: {
          Authorization: `Bearer ${auth0Client.getIdToken()}`,
        },
        params: {
          date,
        },
      }),
    );
    if (!err && res.status === 200) {
      return [null, res.data];
    }
    return [err || 'server error', null];
  }
}

export class GetMembers extends AxiosRequest {
  async call() {
    this.refreshToken();
    const uri = `${API_HOST}/members`;
    const [err, res] = await to(
      axios.get(uri, {
        cancelToken: this.getCancelToken(),
        headers: {
          Authorization: `Bearer ${auth0Client.getIdToken()}`,
        },
      }),
    );
    if (!err && res.status === 200) {
      return [null, res.data];
    }
    return [err || 'server error', null];
  }
}

export class GetAllAttendance extends AxiosRequest {
  async call() {
    this.refreshToken();
    const uri = `${API_HOST}/attendance`;
    const [err, res] = await to(
      axios.get(uri, {
        cancelToken: this.getCancelToken(),
        headers: {
          Authorization: `Bearer ${auth0Client.getIdToken()}`,
        },
      }),
    );
    if (!err && res.status === 200) {
      return [null, res.data];
    }
    return [err || 'server error', null];
  }
}

export class PostNewMember extends AxiosRequest {
  async call(name, status, remarks) {
    this.refreshToken();
    const uri = `${API_HOST}/new`;
    const [err, res] = await to(
      axios.post(
        uri,
        { name, status, remarks },
        {
          cancelToken: this.getCancelToken(),
          headers: {
            Authorization: `Bearer ${auth0Client.getIdToken()}`,
          },
        },
      ),
    );
    if (!err && res.status === 200) {
      return [null, res.data];
    }
    return [err || 'server error', null];
  }
}

export class UpdateMember extends AxiosRequest {
  async call(id, name, status, remarks) {
    this.refreshToken();
    const uri = `${API_HOST}/member/${id}`;
    const [err, res] = await to(
      axios.put(
        uri,
        { name, status, remarks },
        {
          cancelToken: this.getCancelToken(),
          headers: {
            Authorization: `Bearer ${auth0Client.getIdToken()}`,
          },
        },
      ),
    );
    if (!err && res.status === 200) {
      return [null, true];
    }
    return [err || 'server error', null];
  }
}
