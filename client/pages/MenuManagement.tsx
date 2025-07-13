import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Coffee,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  Star,
  Image,
} from "lucide-react";

interface DrinkItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  prepTime: number;
  image?: string;
  isAvailable: boolean;
  popularity: number;
}

export default function MenuManagement() {
  const [drinks, setDrinks] = useState<DrinkItem[]>([
    {
      id: "1",
      name: "Caramel Macchiato",
      description: "Rich espresso with steamed milk and caramel sauce",
      price: 6.5,
      category: "Hot Coffee",
      ingredients: [
        "Espresso",
        "Steamed Milk",
        "Caramel Sauce",
        "Vanilla Syrup",
      ],
      prepTime: 4,
      isAvailable: true,
      popularity: 4.8,
    },
    {
      id: "2",
      name: "Iced Americano",
      description: "Bold espresso shots over ice with cold water",
      price: 4.0,
      category: "Iced Coffee",
      ingredients: ["Espresso", "Ice", "Cold Water"],
      prepTime: 2,
      isAvailable: true,
      popularity: 4.5,
    },
    {
      id: "3",
      name: "Vanilla Latte",
      description: "Smooth espresso with steamed milk and vanilla",
      price: 5.5,
      category: "Hot Coffee",
      ingredients: ["Espresso", "Steamed Milk", "Vanilla Syrup", "Milk Foam"],
      prepTime: 3,
      isAvailable: false,
      popularity: 4.6,
    },
  ]);

  const [isAddDrinkOpen, setIsAddDrinkOpen] = useState(false);
  const [editingDrink, setEditingDrink] = useState<DrinkItem | null>(null);
  const [newDrink, setNewDrink] = useState<Partial<DrinkItem>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    ingredients: [],
    prepTime: 0,
    isAvailable: true,
  });

  const categories = [
    "Hot Coffee",
    "Iced Coffee",
    "Tea",
    "Specialty",
    "Non-Coffee",
  ];

  const handleAddDrink = () => {
    if (newDrink.name && newDrink.price && newDrink.category) {
      const drink: DrinkItem = {
        id: Date.now().toString(),
        name: newDrink.name,
        description: newDrink.description || "",
        price: newDrink.price,
        category: newDrink.category,
        ingredients: newDrink.ingredients || [],
        prepTime: newDrink.prepTime || 3,
        isAvailable: true,
        popularity: 0,
      };

      setDrinks([...drinks, drink]);
      setNewDrink({
        name: "",
        description: "",
        price: 0,
        category: "",
        ingredients: [],
        prepTime: 0,
        isAvailable: true,
      });
      setIsAddDrinkOpen(false);
    }
  };

  const handleEditDrink = (drink: DrinkItem) => {
    setEditingDrink(drink);
    setNewDrink(drink);
    setIsAddDrinkOpen(true);
  };

  const handleUpdateDrink = () => {
    if (editingDrink && newDrink.name && newDrink.price && newDrink.category) {
      setDrinks(
        drinks.map((drink) =>
          drink.id === editingDrink.id ? { ...drink, ...newDrink } : drink,
        ),
      );
      setEditingDrink(null);
      setNewDrink({
        name: "",
        description: "",
        price: 0,
        category: "",
        ingredients: [],
        prepTime: 0,
        isAvailable: true,
      });
      setIsAddDrinkOpen(false);
    }
  };

  const handleDeleteDrink = (id: string) => {
    setDrinks(drinks.filter((drink) => drink.id !== id));
  };

  const toggleAvailability = (id: string) => {
    setDrinks(
      drinks.map((drink) =>
        drink.id === id ? { ...drink, isAvailable: !drink.isAvailable } : drink,
      ),
    );
  };

  const handleIngredientsChange = (value: string) => {
    const ingredients = value
      .split(",")
      .map((ing) => ing.trim())
      .filter((ing) => ing);
    setNewDrink({ ...newDrink, ingredients });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Menu Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your drink menu and availability
            </p>
          </div>
          <Dialog open={isAddDrinkOpen} onOpenChange={setIsAddDrinkOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-brand-blue to-brand-blue-dark">
                <Plus className="w-4 h-4 mr-2" />
                Add Drink
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingDrink ? "Edit Drink" : "Add New Drink"}
                </DialogTitle>
                <DialogDescription>
                  {editingDrink
                    ? "Update the drink details below."
                    : "Add a new drink to your menu."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Drink Name</Label>
                  <Input
                    id="name"
                    value={newDrink.name}
                    onChange={(e) =>
                      setNewDrink({ ...newDrink, name: e.target.value })
                    }
                    placeholder="e.g., Caramel Macchiato"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newDrink.description}
                    onChange={(e) =>
                      setNewDrink({ ...newDrink, description: e.target.value })
                    }
                    placeholder="Describe your drink..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.25"
                      value={newDrink.price}
                      onChange={(e) =>
                        setNewDrink({
                          ...newDrink,
                          price: parseFloat(e.target.value),
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prepTime">Prep Time (min)</Label>
                    <Input
                      id="prepTime"
                      type="number"
                      value={newDrink.prepTime}
                      onChange={(e) =>
                        setNewDrink({
                          ...newDrink,
                          prepTime: parseInt(e.target.value),
                        })
                      }
                      placeholder="3"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newDrink.category}
                    onValueChange={(value) =>
                      setNewDrink({ ...newDrink, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ingredients">
                    Ingredients (comma separated)
                  </Label>
                  <Input
                    id="ingredients"
                    value={newDrink.ingredients?.join(", ")}
                    onChange={(e) => handleIngredientsChange(e.target.value)}
                    placeholder="Espresso, Steamed Milk, Caramel Sauce"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddDrinkOpen(false);
                      setEditingDrink(null);
                      setNewDrink({
                        name: "",
                        description: "",
                        price: 0,
                        category: "",
                        ingredients: [],
                        prepTime: 0,
                        isAvailable: true,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editingDrink ? handleUpdateDrink : handleAddDrink}
                  >
                    {editingDrink ? "Update" : "Add"} Drink
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Drinks
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {drinks.length}
                  </p>
                </div>
                <Coffee className="h-8 w-8 text-brand-blue" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">
                    {drinks.filter((d) => d.isAvailable).length}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    $
                    {(
                      drinks.reduce((acc, d) => acc + d.price, 0) /
                      drinks.length
                    ).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Rated</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.max(...drinks.map((d) => d.popularity)).toFixed(1)}⭐
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drinks.map((drink) => (
            <Card
              key={drink.id}
              className={`${!drink.isAvailable ? "opacity-60" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{drink.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {drink.description}
                    </CardDescription>
                  </div>
                  <div className="ml-2">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{drink.category}</Badge>
                    <span className="text-lg font-bold text-green-600">
                      ${drink.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {drink.prepTime} min
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {drink.popularity.toFixed(1)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-600">
                      Ingredients:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {drink.ingredients.map((ingredient, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant={drink.isAvailable ? "outline" : "default"}
                      size="sm"
                      onClick={() => toggleAvailability(drink.id)}
                    >
                      {drink.isAvailable
                        ? "Mark Unavailable"
                        : "Mark Available"}
                    </Button>

                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDrink(drink)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDrink(drink.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
