import axios from 'axios';
import { Alert } from 'react-native';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

instance.interceptors.request.use(
  async (config) => {

    return config;
  }
);

instance.interceptors.response.use(response => {
  return response;
}, (error) => {
  if (error.message === 'Network Error') {
    Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ');
    return Promise.reject(error);
  }
  if (error.response.status === 401) {
    Alert.alert('Lỗi', 'Vui lòng đăng nhập lại', [
      {
        text: 'Đăng nhập',
        onPress: () => {
          // di chuyển đến trang login băng navigation

        }
      }

    ]);
  }

  return Promise.reject(error);
})

export default instance;