// export enum TransactionType {
//     ASK_QUESTION = 'ask_question',
//     ADD_ANSWER = 'add_answer',
//     COMMENT_ANSWER = 'comment_answer',
//     EXPERT_COMMENT_ANSWER = 'expert_comment_reward',
//     LIKE_ANSWER = 'like_answer',
// }

// export const TransactionTypeValues: Record<TransactionType, number> = {
//     [TransactionType.ASK_QUESTION]: 1,
//     [TransactionType.ADD_ANSWER]: 2,
//     [TransactionType.COMMENT_ANSWER]: 3,
//     [TransactionType.EXPERT_COMMENT_ANSWER]: 4,
//     [TransactionType.LIKE_ANSWER]: 5,
//   };

export enum TransactionType {
    ASK_QUESTION = 1,
    ADD_ANSWER = 2,
    COMMENT_ANSWER = 3,
    EXPERT_COMMENT_ANSWER = 4,
    LIKE_ANSWER = 5,
    DISLIKE_ANSWER = 6
}