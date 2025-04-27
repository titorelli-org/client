export type Labels = "spam" | "ham";

export type CasReasons = "totem" | "lols" | "cas" | "chain" | "generic";

export type PredictionReasons = "classifier" | "duplicate" | "totem" | "cas";

export type LabeledExample = {
  label: Labels;
  text: string;
};

export type UnlabeledExample = {
  text: string;
};

export type Prediction = {
  reason: PredictionReasons;
  label: Labels;
  confidence: number;
};

export type CasPrediction = {
  banned: boolean;
  reason: CasReasons;
};

export type AuthenticationResult = {
  access_token: string;
  token_type: string;
  scope: string;
};
