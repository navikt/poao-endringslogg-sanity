export type SanityDocument = {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  date: string;
  description?: any[];
  modal?: Object;
  linkAttributes?: Object;
  title: string;
  appName: string;
};
export type UserData = {
  userId: string;
  openedLink: boolean;
  openedModal: boolean;
  documentId: string;
  timeStamp: string;
};

export type UserSessionData = {
  userId: string;
  appId: string;
  duration: number;
  unseenFields: number;
  timeStamp: string;
};

export type UserSessionDurationStatistics = {
  tidsintervall: string;
  "0 uleste mld": number;
  "1 uleste mld": number;
  "2 uleste mld": number;
  "3 uleste mld": number;
  "4 uleste mld": number;
  "5+ uleste mld": number;
};

export type UniqueUsersPerDayData = {
  date: string;
  users: number;
};

export type App = {
  name: string;
  _type: string;
};

export type History = {
  id: string;
  timestamp: string;
  author: string;
  mutations?: [
    {
      create: {
        _id: string;
        _rev: string;
      };
    }
  ];
  documentIDs?: string[];
};

export type Author = {
  createdAt: string;
  familyName?: string;
  givenName?: string;
  id: string;
  middleName?: string;
  projectId: string;
  sanityUserId: string;
  updatedAt: string;
  displayName?: string;
  imageUrl?: string;
  email?: string;
  loginProvider: string;
};

export type DateRange = {
  startDate: string;
  endDate?: string;
  key: string;
};
