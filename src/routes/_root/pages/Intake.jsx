import React, { useState, useEffect } from "react";
import { fetchNutritionData } from "../../../lib/nutritionix/api";
import {
  getCurrentUser,
  addMeal,
  updateMeal,
  fetchUserMeals,
  calculateTotalCalories,
} from "../../../lib/firebase/api";
import { Input, Select, Button, Card, List, Typography } from "antd";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Intake = () => {
  const [meals, setMeals] = useState([]); // State to store meal data
  const [foodItem, setFoodItem] = useState("");
  const [mealType, setMealType] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0); // State to store total calories
  const [goalCalories, setGoalCalories] = useState(2500); // Set your goal calorie count

  const currentUser = getCurrentUser();

  // Function to handle adding a new meal
  const handleAddMeal = async () => {
    try {
      setLoading(true);
      const calories = await fetchNutritionData(foodItem);
      const foods = [{ foodName: foodItem, calories }];
      const mealId = await addMeal(currentUser.uid, mealType, foods);
      setFoodItem("");
      fetchData();
    } catch (error) {
      console.error("Error adding meal:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deleting a food item from a meal
  const handleDeleteFoodItem = async (mealId, foodIndex) => {
    try {
      const mealToUpdate = meals.find((meal) => meal.id === mealId);
      const updatedFoods = mealToUpdate.foods.filter(
        (_, index) => index !== foodIndex
      );
      await updateMeal(mealId, updatedFoods);
      fetchData();
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  // Function to fetch meal data and total calories
  const fetchData = async () => {
    try {
      const userMeals = await fetchUserMeals(currentUser.uid);
      setMeals(userMeals);
      const totalCals = await calculateTotalCalories(currentUser.uid);
      setTotalCalories(totalCals);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch meal data and total calories when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-h-screen">
      <h1 className="font-extrabold text-4xl dark: text-light-1" level={2}>
        Remaining calories
      </h1>
      <Card className="mb-6 dark:bg-accent-dark text-black dark:text-light-2">
        {/* Display total calories and remaining calories */}
        <Text className="dark:bg-accent-dark text-black dark:text-light-2">
          Goals: {goalCalories} - Consumed: {totalCalories.toFixed(2)} ={" "}
          {(goalCalories - totalCalories).toFixed(2)}
        </Text>
      </Card>
      <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
        <Input
          className="flex-1 h-8 rounded-md mb-2 md:mb-0"
          value={foodItem}
          onChange={(e) => setFoodItem(e.target.value)}
          placeholder="Enter food item"
        />
        <Select
          defaultValue="breakfast"
          placeholder="Breakfast"
          value={mealType}
          onChange={(value) => setMealType(value)}
          className="flex-1 mb-2 md:mb-0"
        >
          <Option value="breakfast">Breakfast</Option>
          <Option value="lunch">Lunch</Option>
          <Option value="dinner">Dinner</Option>
          <Option value="snack">Snack</Option>
        </Select>
        <Button
          type="primary"
          onClick={handleAddMeal}
          className="w-full md:w-auto"
          loading={loading}
          icon={loading ? antIcon : null}
        >
          Add Meal
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {["breakfast", "lunch", "dinner", "snack"].map((meal) => (
          <Card
            key={meal}
            title={meal.charAt(0).toUpperCase() + meal.slice(1)}
            className="dark:bg-accent-dark text-black dark:text-light-2 shadow-md"
          >
            <div>
              Total Calories:{" "}
              {meals
                .filter((m) => m.mealType === meal)
                .reduce((acc, m) => acc + m.totalCalories, 0)
                .toFixed(2)}
            </div>
            {meals.some((m) => m.mealType === meal && m.foods.length > 0) ? (
              <List
                bordered
                dataSource={meals
                  .filter((m) => m.mealType === meal)
                  .flatMap((m) => m.foods)}
                renderItem={(food, index) => (
                  <List.Item
                    actions={[
                      <DeleteOutlined
                        onClick={() =>
                          handleDeleteFoodItem(
                            meals.find((m) => m.foods.includes(food)).id,
                            index
                          )
                        }
                        className="text-red"
                      />,
                    ]}
                  >
                    <Text>
                      {food.foodName}: {food.calories.toFixed(2)} cal
                    </Text>
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center text-gray-500">
                No food items added
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Intake;
