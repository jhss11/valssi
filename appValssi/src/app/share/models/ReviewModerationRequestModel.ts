import { ReviewModel } from "./ReviewModel";
import { UserModel } from "./UserModel";

export interface ReviewModerationRequestModel {
  id: number;
  review: ReviewModel;
  reviewId: number;
  user: UserModel;
  userId: number;
  reason: string;
}
