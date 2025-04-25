export const generateRoomId = (question_id: number, user1: number, user2: number): string => {
    const sorted = [user1, user2].sort((a, b) => a - b);
    return `room_q${question_id}_u${sorted[0]}_u${sorted[1]}`;
};
  