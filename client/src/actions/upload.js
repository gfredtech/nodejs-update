import {
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAIL,
  SEND_EMAIL_SUCCESS,
  SEND_EMAIL_FAIL,
  DOWNLOAD_LINK_FAIL,
  DOWNLOAD_LINK_SUCCESS,
  HIDE_LINK
} from './types';
import { setAlert } from './alert';

import axios from 'axios';
// const base_url = 'http://localhost:4000';

const base_url = 'https://x-shareserver.herokuapp.com';
export const hidelink = () => async => dispatch => {
  dispatch({
    type: HIDE_LINK
  });
};
export const uploadFile = file => async dispatch => {
  const fd = new FormData();

  // fd.append('name', name);
  // fd.append('to', to);
  // fd.append('isEmail', true);
  fd.append('file', file);

  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'multipart/form-data'
    }
  };
  try {
    const response = await axios.post(
      base_url + '/api/auth/upload',
      fd,
      config
    );
    console.log(response);
    if (response.data.success) {
      dispatch({
        type: UPLOAD_FILE_SUCCESS,
        payload: response.data
      });
      dispatch(setAlert(response.data.message, 'success'));
    } else {
      dispatch(setAlert(response.data.message, 'danger'));
      dispatch({
        type: UPLOAD_FILE_FAIL,
        payload: response.data.message
      });
    }
  } catch (error) {
    dispatch(setAlert(error.toString(), 'danger'));

    dispatch({
      type: UPLOAD_FILE_FAIL,
      payload: error.toString()
    });
  }
};
export const sendEmail = (name, to, message, link) => async dispatch => {
  const body = JSON.stringify({
    name,
    to,
    message,
    link
  });
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  };
  try {
    const response = await axios.post(
      base_url + '/api/auth/sendEmail',
      body,
      config
    );
    console.log(response);
    if (response.data.success) {
      dispatch({
        type: SEND_EMAIL_SUCCESS
      });
      dispatch(setAlert(`The file was sent to ${to} successfully`, 'success'));
    } else {
      dispatch(setAlert('Error sending Email', 'danger'));
      dispatch({
        type: SEND_EMAIL_FAIL
      });
    }
  } catch (error) {
    dispatch(setAlert('Error sending Email', 'danger'));
    dispatch({
      type: SEND_EMAIL_FAIL
    });
  }
};
export const downloadLink = shortCode => async dispatch => {
  try {
    const response = await axios.post(base_url + `/${shortCode}`);
    console.log(response);
    if (response.data.success) {
      dispatch({
        type: DOWNLOAD_LINK_SUCCESS
      });
      dispatch(setAlert(`File downloaded successfully`, 'success'));
    } else {
      dispatch(setAlert('Error downloading file', 'danger'));
      dispatch({
        type: DOWNLOAD_LINK_FAIL
      });
    }
  } catch (error) {
    dispatch(setAlert('Error downloading file', 'danger'));
    dispatch({
      type: DOWNLOAD_LINK_FAIL
    });
  }
};
