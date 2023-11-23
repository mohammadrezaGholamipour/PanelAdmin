import HttClient from './axios-base'
export default {
  get: (queryParams) => HttClient.get('v1/Panel/GetPollResult', { params: queryParams }),
  delete: (pollId) => HttClient.post(`v1/Panel/DeletePoll/${pollId}`),
  ActiveDeactivePoll: (pollId) => HttClient.post('v1/Panel/ActiveDeactivePoll', pollId),
  SetIsAccept: (pollId) => HttClient.post(`v1/Panel/SetIsAccept?pollid=${pollId}`),
  endPoll: (pollId) => HttClient.post(`v1/Panel/EndPoll/${pollId}`),
  new: (survey) => HttClient.post('v1/Panel/AddPoll', survey),
  edit: (survey) => HttClient.post('v1/Panel/EditPoll', survey),
}; 