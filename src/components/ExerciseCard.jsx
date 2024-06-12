import React from "react";
import { Card } from "antd";
import { ClockCircleOutlined, DingdingOutlined, FundViewOutlined, ToolOutlined } from '@ant-design/icons';

const ExerciseCard = ({ exercise }) => {
  return (
    <Card
      title={exercise.name}
      className="dark:bg-accent-dark text-black dark:text-light-2"
      style={{ width: '30%', marginBottom: 20, marginRight: 20 }}
    >
      <p><ClockCircleOutlined /> Type: {exercise.type}</p>
      <p><DingdingOutlined /> Difficulty: {exercise.difficulty}</p>
      <p><ToolOutlined /> Equipment: {exercise.equipment}</p>
      <p><FundViewOutlined /> Muscle: {exercise.muscle}</p>
    </Card>
  );
};

export default ExerciseCard;
