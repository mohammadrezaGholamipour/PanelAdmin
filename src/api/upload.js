import HttClient from './axios-base'
export default {
  profile: (profile) => HttClient.post('v1/Panel/UploadFile', profile, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
}; 