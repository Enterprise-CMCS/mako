import { Action } from "shared-types";
import {
  MakoWriteService,
  IssueRaiDto as MakoIssueRaiDto,
  CompleteIntakeDto as MakoCompleteIntake,
  RespondToRaiDto as MakoRespondToRai,
  WithdrawRaiDto as MakoWithdrawRai,
  ToggleRaiResponseDto,
  RemoveAppkChildDto as MakoRemoveAppkChild,
  WithdrawPackageDto as MakoWithdrawPackage,
  UpdateIdDto as MakoUpdateId,
} from "./mako-write-service";
import {
  SeatoolWriteService,
  IssueRaiDto as SeaIssueRaiDto,
  CompleteIntakeDto as SeaCompleteIntake,
  RespondToRaiDto as SeaRespondToRai,
  WithdrawRaiDto as SeaWithdrawRai,
  RemoveAppkChildDto as SeaRemoveAppkChild,
  WithdrawPackageDto as SeaWithdrawPackage,
  UpdateIdDto as SeaUpdateId,
} from "./seatool-write-service";

type IdsToUpdateFunction = (lookupId: string) => Promise<string[]>;

export type CompleteIntakeDto = MakoCompleteIntake & SeaCompleteIntake;
export type IssueRaiDto = SeaIssueRaiDto & MakoIssueRaiDto;
export type RespondToRaiDto = SeaRespondToRai & MakoRespondToRai;
export type WithdrawRaiDto = SeaWithdrawRai & MakoWithdrawRai;
export type RemoveAppkChildDto = SeaRemoveAppkChild & MakoRemoveAppkChild;
export type WithdrawPackageDto = SeaWithdrawPackage & MakoWithdrawPackage;
export type UpdateIdDto = SeaUpdateId & MakoUpdateId;

export type PackageWriteClass = {
  completeIntake: (data: CompleteIntakeDto) => Promise<void>;
  issueRai: (data: IssueRaiDto) => Promise<void>;
  respondToRai: (data: RespondToRaiDto) => Promise<void>;
  withdrawRai: (data: WithdrawRaiDto) => Promise<void>;
  toggleRaiResponseWithdraw: (data: ToggleRaiResponseDto) => Promise<void>;
  removeAppkChild: (data: RemoveAppkChildDto) => Promise<void>;
  withdrawPackage: (data: WithdrawPackageDto) => Promise<void>;
  updateId: (data: UpdateIdDto) => Promise<void>;
};

export class MockPackageActionWriteService implements PackageWriteClass {
  async issueRai(data: IssueRaiDto) {
    console.log("hello");
  }
  async respondToRai(data: RespondToRaiDto) {
    console.log("hello");
  }
  async withdrawRai(data: WithdrawRaiDto) {
    console.log("hello");
  }
  async toggleRaiResponseWithdraw(data: ToggleRaiResponseDto) {
    console.log("hello");
  }
  async removeAppkChild(data: RemoveAppkChildDto) {
    console.log("hello");
  }
  async withdrawPackage(data: WithdrawPackageDto) {
    console.log("hello");
  }
  async updateId(data: UpdateIdDto) {
    console.log("hello");
  }
  async completeIntake(data: CompleteIntakeDto) {
    console.log("hello");
  }
}

export class PackageActionWriteService implements PackageWriteClass {
  #seatoolWriteService: SeatoolWriteService;
  #makoWriteService: MakoWriteService;
  #getIdsToUpdate: IdsToUpdateFunction;

  constructor(
    seatool: SeatoolWriteService,
    mako: MakoWriteService,
    idsToUpdateFunction: IdsToUpdateFunction,
  ) {
    this.#makoWriteService = mako;
    this.#seatoolWriteService = seatool;
    this.#getIdsToUpdate = idsToUpdateFunction;
  }

  async completeIntake({
    action,
    cpoc,
    description,
    id,
    subTypeIds,
    subject,
    submitterName,
    timestamp,
    topicName,
    typeIds,
    ...data
  }: CompleteIntakeDto) {
    try {
      await this.#seatoolWriteService.trx.begin();
      await this.#seatoolWriteService.completeIntake({
        typeIds,
        subTypeIds,
        id,
        cpoc,
        description,
        subject,
        submitterName,
      });
      await this.#makoWriteService.completeIntake({
        action,
        id,
        timestamp,
        topicName,
        ...data,
      });
      await this.#seatoolWriteService.trx.commit();
    } catch (err: unknown) {
      console.log("AN ERROR OCCURED: ", err);
      this.#seatoolWriteService.trx.rollback();
    }
  }

  async issueRai({
    action,
    id,
    spwStatus,
    today,
    timestamp,
    topicName,
    ...data
  }: IssueRaiDto) {
    try {
      await this.#seatoolWriteService.trx.begin();
      const idsToUpdate = await this.#getIdsToUpdate(id);

      for (const id of idsToUpdate) {
        await this.#seatoolWriteService.issueRai({ id, spwStatus, today });
        await this.#makoWriteService.issueRai({
          action,
          id,
          timestamp,
          topicName,
          ...data,
        });
      }

      await this.#seatoolWriteService.trx.commit();
    } catch (err: unknown) {
      await this.#seatoolWriteService.trx.rollback();

      console.error(err);
    }
  }

  async respondToRai({
    action,
    id,
    raiReceivedDate,
    raiToRespondTo,
    raiWithdrawnDate,
    responseDate,
    spwStatus,
    today,
    timestamp,
    topicName,
    ...data
  }: RespondToRaiDto) {
    try {
      await this.#seatoolWriteService.trx.begin();
      const idsToUpdate = await this.#getIdsToUpdate(id);

      for (const id of idsToUpdate) {
        await this.#seatoolWriteService.respondToRai({
          id,
          spwStatus,
          today,
          raiReceivedDate,
          raiToRespondTo,
          raiWithdrawnDate,
        });
        await this.#makoWriteService.respondToRai({
          action,
          id,
          topicName,
          timestamp,
          responseDate,
          ...data,
        });
      }

      await this.#seatoolWriteService.trx.commit();
    } catch (err: unknown) {
      await this.#seatoolWriteService.trx.rollback();

      console.error(err);
    }
  }

  async withdrawRai({
    id,
    spwStatus,
    today,
    timestamp,
    raiReceivedDate,
    raiToWithdraw,
    raiRequestedDate,
    action,
    topicName,
    withdrawnDate,
    ...data
  }: WithdrawRaiDto) {
    try {
      await this.#seatoolWriteService.trx.begin();
      const idsToUpdate = await this.#getIdsToUpdate(id);

      for (const id of idsToUpdate) {
        await this.#seatoolWriteService.withdrawRai({
          id,
          spwStatus,
          today,
          raiReceivedDate,
          raiToWithdraw,
          raiRequestedDate,
        });
        await this.#makoWriteService.withdrawRai({
          action,
          id,
          topicName,
          timestamp,
          withdrawnDate,
          ...data,
        });
      }

      await this.#seatoolWriteService.trx.commit();
    } catch (err: unknown) {
      await this.#seatoolWriteService.trx.rollback();

      console.error(err);
    }
  }

  async toggleRaiResponseWithdraw(data: ToggleRaiResponseDto) {
    try {
      const idsToUpdate = await this.#getIdsToUpdate(data.id);

      for (const id of idsToUpdate) {
        await this.#makoWriteService.toggleRaiResponseWithdraw({
          ...data,
          id,
        });
      }
    } catch (err: unknown) {
      console.error(err);
    }
  }

  async removeAppkChild({
    id,
    timestamp,
    today,
    spwStatus,
    action,
    topicName,
    ...data
  }: RemoveAppkChildDto) {
    try {
      await this.#seatoolWriteService.trx.begin();
      const idsToUpdate = [id];

      for (const id of idsToUpdate) {
        await this.#seatoolWriteService.removeAppkChild({
          id,
          spwStatus,
          today,
        });
        await this.#makoWriteService.removeAppkChild({
          action,
          id,
          topicName,
          timestamp,
          ...data,
        });
      }

      await this.#seatoolWriteService.trx.commit();
    } catch (err: unknown) {
      await this.#seatoolWriteService.trx.rollback();

      console.error(err);
    }
  }

  async withdrawPackage({
    id,
    timestamp,
    today,
    spwStatus,
    action,
    topicName,
    ...data
  }: WithdrawPackageDto) {
    try {
      await this.#seatoolWriteService.trx.begin();
      const idsToUpdate = await this.#getIdsToUpdate(id);

      for (const id of idsToUpdate) {
        await this.#seatoolWriteService.withdrawPackage({
          id,
          spwStatus,
          today,
        });
        await this.#makoWriteService.withdrawPackage({
          action,
          id,
          topicName,
          timestamp,
          ...data,
        });
      }
      await this.#seatoolWriteService.trx.commit();
    } catch (err: unknown) {
      await this.#seatoolWriteService.trx.rollback();

      console.error(err);
    }
  }

  async updateId({
    id,
    timestamp,
    today,
    spwStatus,
    action,
    topicName,
    newId,
    ...data
  }: UpdateIdDto) {
    try {
      await this.#seatoolWriteService.trx.begin();
      const idsToUpdate = [id];

      for (const id of idsToUpdate) {
        await this.#seatoolWriteService.updateId({
          id,
          spwStatus,
          today,
          newId,
        });
        await this.#makoWriteService.updateId({
          action,
          id,
          timestamp,
          topicName,
          newId,
          ...data,
        });
      }
      await this.#seatoolWriteService.trx.commit();
    } catch (err: unknown) {
      await this.#seatoolWriteService.trx.rollback();

      console.error(err);
    }
  }
}
