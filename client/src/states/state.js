import { atom } from "recoil";

export const defaultFormState = {
    age: '',
    gender: '',
    bmiSelection: '',
    bmi: '',
    realBMI: '',
    units: { value: 'us', label: 'US (e.g., 5 feet 9 inches or 115 pounds)' },
    feet: '',
    inches: '',
    cm: '',
    pounds: '',
    kg: '',
    race_group: '',
    raceUnknown: false,
    education: '',
    smoker_type: '',
    start: '',
    end: '',
    cigs: '',
    packYears: '',
    disease: '',
    history: '',
    results: [],
    unstable: false,
    loading: false,
    submitted: false,
  };
  
  export const resultsState = atom({
    key: 'explore.resultsState',
    default: defaultFormState
  })
  
  export const formState = atom({
    key: "explore.formState",
    default: defaultFormState,
  });