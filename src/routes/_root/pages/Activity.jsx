import React, { useEffect, useState } from "react";
import { Spin, Select, Empty } from "antd";
import ExerciseCard from "../../../components/ExerciseCard";
import { searchExercisesByType, searchExercisesByMuscle, searchExercisesByDifficulty } from "../../../lib/Exercise/api";

const { Option } = Select;

const Activity = () => {
  //states
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterMuscle, setFilterMuscle] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");

  //on component mounted
  //fetch the exercise
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        let filteredExercises;
        if (filterType) {
          filteredExercises = await searchExercisesByType(filterType);
        } else if (filterMuscle) {
          filteredExercises = await searchExercisesByMuscle(filterMuscle);
        } else if (filterDifficulty) {
          filteredExercises = await searchExercisesByDifficulty(filterDifficulty);
        } else {
          // Fetch all exercises if no filters are applied
          filteredExercises = await searchExercisesByType("");
        }
        setExercises(filteredExercises.slice(0, 10));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setLoading(false);
      }
    };
    fetchExercises();
  }, [filterType, filterMuscle, filterDifficulty]);

  return (
    <div>
      <h2>Exercise Filters</h2>
      <Select
        placeholder="Select type"
        style={{ width: 200, marginBottom: 10 }}
        onChange={(value) => setFilterType(value)}
      >
        <Option value="">All Types</Option>
        <Option value="cardio">Cardio</Option>
        <Option value="olympic_weightlifting">Olympic Weightlifting</Option>
        <Option value="plyometrics">Plyometrics</Option>
        <Option value="powerlifting">Powerlifting</Option>
        <Option value="strength">Strength</Option>
        <Option value="stretching">Stretching</Option>
        <Option value="strongman">Strongman</Option>
      </Select>
      <Select
        placeholder="Select muscle"
        style={{ width: 200, marginBottom: 10 }}
        onChange={(value) => setFilterMuscle(value)}
      >
        <Option value="">All Muscles</Option>
        <Option value="abdominals">Abdominals</Option>
        <Option value="abductors">Abductors</Option>
        <Option value="adductors">Adductors</Option>
        <Option value="biceps">Biceps</Option>
        <Option value="calves">Calves</Option>
        <Option value="chest">Chest</Option>
        <Option value="forearms">Forearms</Option>
        <Option value="glutes">Glutes</Option>
        <Option value="hamstrings">Hamstrings</Option>
        <Option value="lats">Lats</Option>
        <Option value="lower_back">Lower Back</Option>
        <Option value="middle_back">Middle Back</Option>
        <Option value="neck">Neck</Option>
        <Option value="quadriceps">Quadriceps</Option>
        <Option value="traps">Traps</Option>
        <Option value="triceps">Triceps</Option>
      </Select>
      <Select
        placeholder="Select difficulty"
        style={{ width: 200, marginBottom: 10 }}
        onChange={(value) => setFilterDifficulty(value)}
      >
        <Option value="">All Difficulties</Option>
        <Option value="beginner">Beginner</Option>
        <Option value="intermediate">Intermediate</Option>
        <Option value="expert">Expert</Option>
      </Select>

      <h2>Filtered Exercises</h2>
      {/* case where the api is fetching data */}
      {loading ? (
        <Spin />
      ) : exercises.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
          {exercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} />
          ))}
        </div>
      ) : (
        // case where no data
        <Empty />
      )}
    </div>
  );
};

export default Activity;
