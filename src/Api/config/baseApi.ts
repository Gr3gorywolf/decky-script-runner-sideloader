import axios from 'axios';

export const getApi = () => {
  return axios.create({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    baseURL: `https://${window.STEAM_DECK_IP}:9696`,
  });
};
