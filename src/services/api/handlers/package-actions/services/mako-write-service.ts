import { type Action } from "shared-types";
import { getNextBusinessDayTimestamp } from "shared-utils";

export type MessageProducer = (
  topic: string,
  key: string,
  value: string,
) => Promise<void>;

export type CompleteIntakeDto = {
  topicName: string;
  id: string;
  action: Action;
  timestamp: number;
} & Record<string, unknown>;

export type IssueRaiDto = {
  topicName: string;
  id: string;
  action: Action;
} & Record<string, unknown>;

export type RespondToRaiDto = {
  topicName: string;
  id: string;
  action: Action;
  responseDate: number;
} & Record<string, unknown>;

export type ToggleRaiResponseDto = {
  topicName: string;
  id: string;
  action: Action;
} & Record<string, unknown>;

export type WithdrawRaiDto = {
  topicName: string;
  id: string;
  action: Action;
} & Record<string, unknown>;

export type RemoveAppkChildDto = {
  topicName: string;
  id: string;
  action: Action;
} & Record<string, unknown>;

export type WithdrawPackageDto = {
  topicName: string;
  id: string;
  action: Action;
} & Record<string, unknown>;

export class MakoWriteService {
  #messageProducer: MessageProducer;

  constructor(messageProducer: MessageProducer) {
    this.#messageProducer = messageProducer;
  }

  async completeIntake({
    action,
    id,
    timestamp,
    topicName,
    ...data
  }: CompleteIntakeDto) {
    await this.#messageProducer(
      topicName,
      id,
      JSON.stringify({
        actionType: action,
        timestamp,
        ...data,
      }),
    );
  }

  async issueRai({ action, id, topicName, ...data }: IssueRaiDto) {
    await this.#messageProducer(
      topicName,
      id,
      JSON.stringify({
        ...data,
        id,
        actionType: action,
      }),
    );
  }

  async respondToRai({
    action,
    id,
    responseDate,
    topicName,
    ...data
  }: RespondToRaiDto) {
    await this.#messageProducer(
      topicName,
      id,
      JSON.stringify({
        ...data,
        id,
        responseDate,
        actionType: action,
        notificationMetadata: {
          submissionDate: getNextBusinessDayTimestamp(),
        },
      }),
    );
  }

  async withdrawRai({ action, id, topicName, ...data }: WithdrawRaiDto) {
    await this.#messageProducer(
      topicName,
      id,
      JSON.stringify({
        ...data,
        id,
        actionType: action,
        notificationMetadata: {
          submissionDate: getNextBusinessDayTimestamp(),
        },
      }),
    );
  }

  async toggleRaiResponseWithdraw({
    action,
    id,
    topicName,
    ...data
  }: ToggleRaiResponseDto) {
    await this.#messageProducer(
      topicName,
      id,
      JSON.stringify({
        ...data,
        id,
        actionType: action,
      }),
    );
  }

  async removeAppkChild({
    action,
    id,
    topicName,
    ...data
  }: RemoveAppkChildDto) {
    await this.#messageProducer(
      topicName,
      id,
      JSON.stringify({
        ...data,
        id,
        actionType: action,
      }),
    );
  }

  async withdrawPackage({
    action,
    id,
    topicName,
    ...data
  }: WithdrawPackageDto) {
    await this.#messageProducer(
      topicName,
      id,
      JSON.stringify({
        ...data,
        id,
        actionType: action,
      }),
    );
  }

  async updateId({ action, id, topicName, ...data }: UpdateIdDto) {
    await this.#messageProducer(
      topicName,
      id,
      JSON.stringify({
        ...data,
        id,
        actionType: action,
      }),
    );
  }
}

export type UpdateIdDto = {
  topicName: string;
  id: string;
  action: Action;
} & Record<string, unknown>;
