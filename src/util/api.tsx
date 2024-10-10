import { defaultAxiosInstance, axiosWithoutLoading } from './axios.customize';

const createUserApi = async (data: { email: string, password: string, userName: string, dob: string, address: string, phoneNumber: string, gender: string, imgUrl: string }) => {
  const URL_API = '/api/user';
  const response = await defaultAxiosInstance.post(URL_API, data);
  return response.data;
};

const loginUserApi = async (data: { email: string, password: string }) => {
  const URL_API = '/api/user/login';
  const response = await defaultAxiosInstance.post(URL_API, data);
  return response.data;
};

const getCurrentLogin = async () => {
  const URL_API = '/api/user/current-user';
  const token = localStorage.getItem('token');
  if (token) {
    const response = await axiosWithoutLoading.get(URL_API);
    return response.data;
  }
};

const verifyUserByIdApi = async (id: number) => {
  const URL_API = `/api/user/verify/${id}`;
  const response = await defaultAxiosInstance.put(URL_API);
  return response.data;
};

const getUserByIdApi = async (id: number) => {
  const URL_API = `/api/user/${id}`;
  const response = await axiosWithoutLoading.get(URL_API);
  return response.data;
};

const createStaffApi = async (email: string, password: string, name: string) => {
  const URL_API = `/api/user/staff?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&name=${encodeURIComponent(name)}`;
  const response = await defaultAxiosInstance.post(URL_API);
  return response.data;
};

const createManagerApi = async (email: string, password: string, name: string) => {
  const URL_API = `/api/user/manager?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&name=${encodeURIComponent(name)}`;
  const response = await defaultAxiosInstance.post(URL_API);
  return response.data;
};

const googleSignUpApi = async (googleId: string) => {
  const URL_API = `/api/user/email?googleId=${googleId}`;
  const response = await defaultAxiosInstance.post(URL_API);
  return response.data;
};

const googleSigInpApi = async (googleId: string) => {
  const URL_API = `/api/user/loginmail?googleId=${googleId}`;
  const response = await defaultAxiosInstance.post(URL_API);
  return response.data;
};

const updateUserByIdApi = async (id: number, data: { userName: string; dob: string; address: string; phoneNumber: string; gender: string; imgUrl: string }) => {
  const URL_API = `/api/user/${id}`;
  const response = await defaultAxiosInstance.put(URL_API, data);
  return response.data;
};

const getAllUserApi = async (data: { pageNum: number; pageSize: number; keyWord: string; role: string; status: boolean; is_Verify: boolean; is_Delete: boolean; }) => {
  const URL_API = '/api/user/search';
  const response = await defaultAxiosInstance.post(URL_API, data);
  return response.data;
};

const changeUserStatusApi = async (id: number, status: boolean) => {
  const URL_API = `/api/user/change-status/${id}?status=${status}`;
  const response = await defaultAxiosInstance.post(URL_API);
  return response.data;
};

const searchClubApi = async (data: { pageNum: number; pageSize: number; keyWord: string; status: boolean }) => {
  const URL_API = '/api/club/search';
  const response = await defaultAxiosInstance.post(URL_API, data);
  return response.data;
};
const getAllClubApi = async (data: { pageNum: number; pageSize: number; keyWord: string; status: boolean }) => {
  const URL_API = '/api/club/search';
  const response = await axiosWithoutLoading.post(URL_API, data);
  return response.data;
};
const createClubApi = async (data: { name: string; country: string; establishedYear: string; stadiumName: string; clubLogo: string; description: string; }) => {
  const URL_API = '/api/club';
  const response = await defaultAxiosInstance.post(URL_API, data);
  return response.data;
};

const editClubApi = async (id: number, data: { name: string; country: string; establishedYear: string; stadiumName: string; clubLogo: string; description: string; status : boolean }) => {
  const URL_API = `/api/club?id=${id}`;
  const response = await defaultAxiosInstance.put(URL_API, data);
  return response.data;
};

const getClubByIdApi = async (id: number) => {
  const URL_API = `/api/club/${id}`;
  const response = await axiosWithoutLoading.get(URL_API);
  return response.data;
};

const changeClubStatusApi = async (id: number, status: boolean) => {
  const URL_API = `/api/club/change-status/${id}?status=${status}`;
  const response = await defaultAxiosInstance.post(URL_API);
  return response.data;
};

const searchSessionApi = async (data: { pageNum: number; pageSize: number; keyWord: string; status: boolean }) => {
  const URL_API = '/api/session/search';
  const response = await defaultAxiosInstance.post(URL_API, data);
  return response.data;
};

const changeSessionStatusApi = async (id: number, status: boolean) => {
  const URL_API = `/api/session/change-status/${id}?status=${status}`;
  const response = await defaultAxiosInstance.delete(URL_API);
  return response.data;
};

const createSessionApi = async (data: { name: string; startDdate: string; endDdate: string; description: string; }) => {
  const URL_API = '/api/session';
  const response = await defaultAxiosInstance.post(URL_API, data);
  return response.data;
};

const getSessionByIdApi = async (id: number) => {
  const URL_API = `/api/session/${id}`;
  const response = await axiosWithoutLoading.get(URL_API);
  return response.data;
};

const editSessionApi = async (id: number, data: { name: string; startDdate: string; endDdate: string; description: string; }) => {
  const URL_API = `/api/session?id=${id}`;
  const response = await defaultAxiosInstance.put(URL_API, data);
  return response.data;
};
const createPlayerApi = async (data: { clubId: number; fullName: string; height: number; weight: number; birthday: string; nationality: string; }) => {
  const URL_API = '/api/player';
  const response = await defaultAxiosInstance.post(URL_API, data);
  return response.data;
};
const getPlayerByIdApi = async (id: number) => {
  const URL_API = `/api/player/${id}`;
  const response = await axiosWithoutLoading.get(URL_API);
  return response.data;
};
const searchPlayerApi = async (data: { pageNum: number; pageSize: number; keyWord: string; status: boolean; }) => {
  const URL_API = '/api/player/search';
  const response = await defaultAxiosInstance.post(URL_API, data);
  return response.data;
};
const changePlayerStatusApi = async (id: number, status: boolean) => {
  const URL_API = `/api/session/player/${id}?status=${status}`;
  const response = await defaultAxiosInstance.delete(URL_API);
  return response.data;
};
const updatePlayerApi = async (id: number, data: { clubId: number; fullName: string; height: number; weight: number; birthday: string; nationality: string; }) => {
  const URL_API = `/api/player/${id}`;
  const response = await defaultAxiosInstance.put(URL_API, data);
  return response.data;
};
const searchTypeShirtApi = async (data: { pageNum: number; pageSize: number; keyWord: string; status: boolean }) => {
  const URL_API = '/api/typeshirt/search';
  const response = await defaultAxiosInstance.post(URL_API, data);
  return response.data;
};
const changeTypeShirtStatusApi = async (id: number, status: boolean) => {
  const URL_API = `/api/typeshirt/change-status/${id}?status=${status}`;
  const response = await defaultAxiosInstance.delete(URL_API);
  return response.data;
};
const getTypeShirtByIdApi = async (id: number) => {
  const URL_API = `/api/typeshirt/${id}`;
  const response = await axiosWithoutLoading.get(URL_API);
  return response.data;
};
const updateTypeShirtApi = async (id: number, data: { sessionId: number; clubId: number; name: string; description: string; status: boolean }) => {
  const URL_API = `/api/typeshirt?id=${id}`;
  const response = await defaultAxiosInstance.put(URL_API, data);
  return response.data;
};
const createTypeShirtApi = async (data: { sessionId: number; clubId: number; name: string; description: string; status: boolean }) => {
  const URL_API = '/api/typeshirt';
  const response = await defaultAxiosInstance.post(URL_API, data);
  return response.data;
};
const createShirtApi = async (data: { typeShirtId: number; playerId: number; name: string; number: number; price: number; date: string; description: string; urlImg: string; status: number }) => {
  const URL_API = '/api/shirt';
  const response = await defaultAxiosInstance.post(URL_API, data);
  return response.data;
};
const searchShirtApi = async (data: { pageNum: number; pageSize: number; keyWord: string; status: number }) => {
  const URL_API = '/api/shirt/search';
  const response = await defaultAxiosInstance.post(URL_API, data);
  return response.data;
};
const getShirtByIdApi = async (id: number, shirtId: number) => {
  const URL_API = `/api/shirt/${id}?shirtId=${shirtId}`;
  const response = await axiosWithoutLoading.get(URL_API);
  return response.data;
};
const changeShirtStatusApi = async (id: number, status: number) => {
  const URL_API = `/api/shirt/${id}?status=${status}`;
  const response = await defaultAxiosInstance.delete(URL_API);
  return response.data;
};
const deleteShirtApi = async (id: number, status: number) => {
  const URL_API = `/api/shirt/${id}?status=${status}`;
  const response = await defaultAxiosInstance.delete(URL_API);
  return response.data;
};
const updateShirtApi = async (id: number, data: { typeShirtId: number; playerId: number; name: string; number: number; price: number; date: string; description: string; urlImg: string; status: number }) => {
  const URL_API = `/api/shirt/${id}`;
  const response = await defaultAxiosInstance.put(URL_API, data);
  return response.data;
};

export { 
  updateShirtApi,
  deleteShirtApi,
  changeShirtStatusApi,
  getShirtByIdApi,
  searchShirtApi,
  createShirtApi,
  createTypeShirtApi,
  updateTypeShirtApi,
  getTypeShirtByIdApi,
  changeTypeShirtStatusApi,
  searchTypeShirtApi,
  updatePlayerApi,
  changePlayerStatusApi,
  searchPlayerApi,
  getPlayerByIdApi,
  createPlayerApi,
  editSessionApi,
  getSessionByIdApi,
  createSessionApi,
  changeSessionStatusApi,
  searchSessionApi,
  createUserApi, 
  loginUserApi, 
  getCurrentLogin, 
  getAllUserApi, 
  changeUserStatusApi, 
  getUserByIdApi, 
  updateUserByIdApi, 
  verifyUserByIdApi, 
  createStaffApi, 
  createManagerApi, 
  googleSignUpApi, 
  googleSigInpApi, 
  searchClubApi, 
  getAllClubApi,
  createClubApi, 
  editClubApi, 
  getClubByIdApi, 
  changeClubStatusApi 
};
