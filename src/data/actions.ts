
export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: "food" | "travel" | "energy" | "shopping";
  co2Savings: number; // kg / year
  difficulty: "easy" | "medium" | "hard";
  costImpact: "saving" | "neutral" | "investment";
  implementationSteps: string[];
}

export const SUSTAINABILITY_ACTIONS: ActionItem[] = [
  // FOOD (13 actions)
  {
    id: "food_01",
    title: "Incorporate Meatless Mondays",
    description: "Go vegetarian for one day every week.",
    category: "food",
    co2Savings: 150,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Plan your meals on Sunday evening.",
      "Stock up on beans, lentils, and fresh vegetables.",
      "Explore tasty vegetarian recipes like lentil curry or vegetable stir-fry."
    ]
  },
  {
    id: "food_02",
    title: "Switch Beef to Chicken",
    description: "Replace beef meals with poultry or fish.",
    category: "food",
    co2Savings: 300,
    difficulty: "easy",
    costImpact: "neutral",
    implementationSteps: [
      "When ordering burgers, opt for grilled chicken instead.",
      "Substitute ground beef with ground turkey in pasta sauces.",
      "Introduce fish or seafood twice a week."
    ]
  },
  {
    id: "food_03",
    title: "Transition to a fully Vegetarian Diet",
    description: "Eliminate all meat products from your diet.",
    category: "food",
    co2Savings: 600,
    difficulty: "medium",
    costImpact: "saving",
    implementationSteps: [
      "Begin by substituting one meal per day.",
      "Ensure you get enough protein from tofu, legumes, and eggs.",
      "Join vegetarian communities for tips and meal prep inspiration."
    ]
  },
  {
    id: "food_04",
    title: "Adopt a plant-based (Vegan) diet",
    description: "Remove all animal-derived products from your meals.",
    category: "food",
    co2Savings: 1100,
    difficulty: "hard",
    costImpact: "saving",
    implementationSteps: [
      "Swap dairy milk for oat, soy, or almond milk.",
      "Use egg replacers or flaxseed meal in baking.",
      "Take a B12 supplement regularly and consult a nutritionist."
    ]
  },
  {
    id: "food_05",
    title: "Zero Food Waste Challenge",
    description: "Compost and finish all groceries to prevent waste.",
    category: "food",
    co2Savings: 120,
    difficulty: "medium",
    costImpact: "saving",
    implementationSteps: [
      "Write a strict grocery list before shopping.",
      "Store leftovers in transparent containers in the fridge.",
      "Freeze ripe fruits and vegetables before they spoil."
    ]
  },
  {
    id: "food_06",
    title: "Grow Your Own Herbs & Greens",
    description: "Start a windowsill garden for basil, mint, and lettuce.",
    category: "food",
    co2Savings: 20,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Purchase a few small pots or recycled containers.",
      "Plant fast-growing seeds like microgreens or basil.",
      "Water regularly and place in a sunny window."
    ]
  },
  {
    id: "food_07",
    title: "Buy Local and Seasonal Produce",
    description: "Shop at farmers' markets to reduce food miles.",
    category: "food",
    co2Savings: 80,
    difficulty: "easy",
    costImpact: "neutral",
    implementationSteps: [
      "Locate farmers' markets in your neighborhood.",
      "Check seasonal charts before buying fruits and vegetables.",
      "Avoid buying imported foods flown from far regions."
    ]
  },
  {
    id: "food_08",
    title: "Avoid Single-Use Food Packaging",
    description: "Choose bulk items and carry reusable produce bags.",
    category: "food",
    co2Savings: 40,
    difficulty: "easy",
    costImpact: "neutral",
    implementationSteps: [
      "Keep reusable mesh bags in your primary shopping bag.",
      "Avoid pre-cut fruits wrapped in plastic trays.",
      "Choose dry goods in cardboard packaging over plastic."
    ]
  },
  {
    id: "food_09",
    title: "Brew Coffee at Home",
    description: "Cut down on disposable cups and commercial coffee travel.",
    category: "food",
    co2Savings: 50,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Invest in a simple French press or coffee maker.",
      "Buy fair-trade coffee beans in bulk.",
      "Use a thermal travel mug when heading out."
    ]
  },
  {
    id: "food_10",
    title: "Switch to Organic Foods",
    description: "Choose foods farmed without chemical fertilizers.",
    category: "food",
    co2Savings: 60,
    difficulty: "medium",
    costImpact: "investment",
    implementationSteps: [
      "Prioritize buying organic for the 'Dirty Dozen' list.",
      "Look for local organic certifications on packaging.",
      "Incorporate foods from regenerative agriculture networks."
    ]
  },
  {
    id: "food_11",
    title: "Reduce Dairy consumption",
    description: "Substitute cheese and butter with plant-based alternatives.",
    category: "food",
    co2Savings: 180,
    difficulty: "medium",
    costImpact: "neutral",
    implementationSteps: [
      "Try nutritional yeast for cheesy flavor in dishes.",
      "Cook with olive oil instead of butter.",
      "Buy almond or cashew-based cheese products."
    ]
  },
  {
    id: "food_12",
    title: "Compost Organic Waste",
    description: "Divert food scraps from landfills where they produce methane.",
    category: "food",
    co2Savings: 100,
    difficulty: "medium",
    costImpact: "neutral",
    implementationSteps: [
      "Set up a small organic counter bin.",
      "Drop off scraps at a community garden or use a home bin.",
      "Keep odors low by layering dry leaves or paper."
    ]
  },
  {
    id: "food_13",
    title: "Drink Tap Water",
    description: "Stop buying bottled water to reduce plastic production emissions.",
    category: "food",
    co2Savings: 70,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Invest in a water filter pitcher.",
      "Carry a reusable stainless steel bottle.",
      "Refill at home rather than purchasing single bottles."
    ]
  },

  // TRAVEL (12 actions)
  {
    id: "travel_01",
    title: "Carpool to Work",
    description: "Share rides with colleagues to split transit emissions.",
    category: "travel",
    co2Savings: 450,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Ask colleagues who live nearby about ride sharing.",
      "Create a shared calendar to organize driving schedules.",
      "Use carpooling apps if available in your area."
    ]
  },
  {
    id: "travel_02",
    title: "Take Public Transit Once a Week",
    description: "Replace one car commute with bus, train, or metro.",
    category: "travel",
    co2Savings: 180,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Download transit routing maps on your phone.",
      "Locate the closest bus stop or train station.",
      "Buy a reloadable transit pass to skip ticket queues."
    ]
  },
  {
    id: "travel_03",
    title: "Combine Weekly Errands",
    description: "Make one combined car trip instead of multiple small ones.",
    category: "travel",
    co2Savings: 120,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Write down all your chores and shopping needs.",
      "Map a single efficient route to visit all locations.",
      "Do all weekly tasks in a single trip on Saturday."
    ]
  },
  {
    id: "travel_04",
    title: "Switch to Electric Vehicle (EV)",
    description: "Replace your gasoline vehicle with an EV.",
    category: "travel",
    co2Savings: 1600,
    difficulty: "hard",
    costImpact: "investment",
    implementationSteps: [
      "Research EV models and battery ranges suitable for your budget.",
      "Install a home charging outlet if feasible.",
      "Look for local government tax credits or subsidies."
    ]
  },
  {
    id: "travel_05",
    title: "Ride a Bicycle for Short Trips",
    description: "Cycle for any trips under 5 kilometers.",
    category: "travel",
    co2Savings: 220,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Purchase a reliable bicycle and safety helmet.",
      "Map out bicycle-friendly lanes and trails in your city.",
      "Use panniers or a basket to carry grocery items."
    ]
  },
  {
    id: "travel_06",
    title: "Work Remotely 2 Days/Week",
    description: "Eliminate commuting emissions entirely twice a week.",
    category: "travel",
    co2Savings: 500,
    difficulty: "medium",
    costImpact: "saving",
    implementationSteps: [
      "Propose a structured work-from-home plan to your manager.",
      "Ensure a reliable internet connection at home.",
      "Use digital collaboration tools to keep output high."
    ]
  },
  {
    id: "travel_07",
    title: "Avoid One Short-Haul Flight",
    description: "Take the train or carpool for short travel destinations.",
    category: "travel",
    co2Savings: 150,
    difficulty: "medium",
    costImpact: "neutral",
    implementationSteps: [
      "Look up high-speed rail lines to your destination.",
      "Enjoy the scenery and utilize travel time to read or work.",
      "Schedule meetings virtually if possible."
    ]
  },
  {
    id: "travel_08",
    title: "Switch to Eco-Friendly Tires",
    description: "Choose low rolling-resistance tires to save fuel.",
    category: "travel",
    co2Savings: 70,
    difficulty: "easy",
    costImpact: "investment",
    implementationSteps: [
      "Check your tire tread and wear.",
      "Consult tire shops for energy-efficient or eco ratings.",
      "Maintain optimal tire pressure to ensure fuel efficiency."
    ]
  },
  {
    id: "travel_09",
    title: "Eco-Driving Habit",
    description: "Avoid rapid acceleration and braking on highways.",
    category: "travel",
    co2Savings: 140,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Accelerate smoothly from a complete stop.",
      "Maintain a steady speed using cruise control.",
      "Drive within speed limits to optimize drag and fuel consumption."
    ]
  },
  {
    id: "travel_10",
    title: "Take a Train Instead of Driving Long Distance",
    description: "Choose rail for intercity transport.",
    category: "travel",
    co2Savings: 240,
    difficulty: "medium",
    costImpact: "neutral",
    implementationSteps: [
      "Book tickets early to secure affordable fares.",
      "Arrive at the train terminal 30 minutes before departure.",
      "Relax, skip highway stress, and reduce carbon footprint."
    ]
  },
  {
    id: "travel_11",
    title: "Use Shared Micromobility",
    description: "Rent electric scooters or shared bikes for urban transit.",
    category: "travel",
    co2Savings: 80,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Register on local e-bike/scooter rental apps.",
      "Locate nearby vehicles parked in designated hubs.",
      "Obey local traffic laws and wear safety gear."
    ]
  },
  {
    id: "travel_12",
    title: "Maintain Vehicle Regularly",
    description: "Get regular oil changes and air filter replacements.",
    category: "travel",
    co2Savings: 90,
    difficulty: "easy",
    costImpact: "investment",
    implementationSteps: [
      "Set calendar reminders for standard service checks.",
      "Replace clogged air filters immediately.",
      "Use the recommended grade of motor oil."
    ]
  },

  // ENERGY (13 actions)
  {
    id: "energy_01",
    title: "Switch to LED Lightbulbs",
    description: "Replace incandescent bulbs with efficient LEDs.",
    category: "energy",
    co2Savings: 90,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Count all active light fixtures in your home.",
      "Purchase matching brightness LED bulbs.",
      "Swap them out and dispose of old bulbs safely."
    ]
  },
  {
    id: "energy_02",
    title: "Unplug Idle Electronics",
    description: "Eliminate vampire power draw when electronics are off.",
    category: "energy",
    co2Savings: 50,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Identify appliances with standby LED indicator lights.",
      "Group television and computer plugs into smart power strips.",
      "Switch off power strips before sleeping or leaving."
    ]
  },
  {
    id: "energy_03",
    title: "Set Thermostat 1°C lower (Winter)",
    description: "Slightly reduce heating demand to save energy.",
    category: "energy",
    co2Savings: 110,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Set your heater to 19°C (68°F) instead of higher.",
      "Wear warm socks and cozy sweaters indoors.",
      "Program a lower setting during sleeping hours."
    ]
  },
  {
    id: "energy_04",
    title: "Wash Clothes in Cold Water",
    description: "Skip heating element usage during laundry cycles.",
    category: "energy",
    co2Savings: 80,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Change wash settings from warm/hot to cold.",
      "Use cold-water formulated liquid detergent.",
      "Run only full wash loads to save water."
    ]
  },
  {
    id: "energy_05",
    title: "Air Dry Clothes",
    description: "Ditch the energy-hog electric dryer for a drying rack.",
    category: "energy",
    co2Savings: 160,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Set up a clothes rack or outdoor line.",
      "Hang wet laundry immediately after the spin cycle.",
      "Utilize sunshine and fresh air to dry fabrics."
    ]
  },
  {
    id: "energy_06",
    title: "Install a Smart Thermostat",
    description: "Automate energy savings when away or sleeping.",
    category: "energy",
    co2Savings: 200,
    difficulty: "medium",
    costImpact: "investment",
    implementationSteps: [
      "Purchase a certified smart thermostat (Nest, Ecobee).",
      "Follow safe wiring guidelines or hire an electrician.",
      "Configure geo-fencing to lower heat when you leave."
    ]
  },
  {
    id: "energy_07",
    title: "Switch to a Green Energy Plan",
    description: "Opt for 100% renewable electricity with your utility.",
    category: "energy",
    co2Savings: 800,
    difficulty: "easy",
    costImpact: "neutral",
    implementationSteps: [
      "Log in to your utility provider's online portal.",
      "Look for green pricing programs or renewable options.",
      "Enroll to ensure electricity is sourced from solar/wind."
    ]
  },
  {
    id: "energy_08",
    title: "Install Rooftop Solar Panels",
    description: "Generate your own clean solar electricity at home.",
    category: "energy",
    co2Savings: 1500,
    difficulty: "hard",
    costImpact: "investment",
    implementationSteps: [
      "Request quotes from reputable solar installers.",
      "Verify roof shading patterns and check structural strength.",
      "Explore financing, solar leases, and solar tax credits."
    ]
  },
  {
    id: "energy_09",
    title: "Upgrade to Energy Star Refrigerator",
    description: "Replace ancient, inefficient kitchen cooling units.",
    category: "energy",
    co2Savings: 140,
    difficulty: "medium",
    costImpact: "investment",
    implementationSteps: [
      "Check the manufacturing date of your current fridge.",
      "Compare refrigerator energy labels at retail shops.",
      "Recycle the old unit properly through utility programs."
    ]
  },
  {
    id: "energy_10",
    title: "Draft Proof Windows and Doors",
    description: "Seal gaps to stop expensive warm air leaks.",
    category: "energy",
    co2Savings: 120,
    difficulty: "easy",
    costImpact: "investment",
    implementationSteps: [
      "Feel for draft leaks around window sills on windy days.",
      "Apply silicone caulking or weatherstripping tape.",
      "Install draft stoppers at the base of doors."
    ]
  },
  {
    id: "energy_11",
    title: "Take Shorter Showers",
    description: "Reduce hot water heater usage by showering under 5 minutes.",
    category: "energy",
    co2Savings: 130,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Set a phone timer for 5 minutes.",
      "Use a low-flow aerating showerhead.",
      "Focus on cleaning quickly to avoid thermal waste."
    ]
  },
  {
    id: "energy_12",
    title: "Insulate Hot Water Pipes",
    description: "Retain heat in pipes so water reaches taps warmer.",
    category: "energy",
    co2Savings: 60,
    difficulty: "easy",
    costImpact: "investment",
    implementationSteps: [
      "Buy foam pipe insulation sleeves at hardware stores.",
      "Slide sleeves over exposed hot water pipes.",
      "Secure insulation joins with tape or cable ties."
    ]
  },
  {
    id: "energy_13",
    title: "Set Refrigerator to Optimal Temp",
    description: "Overcooling wastes carbon. Maintain standard levels.",
    category: "energy",
    co2Savings: 40,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Place a thermometer inside the fridge and freezer.",
      "Calibrate fridge to 3-4°C and freezer to -18°C.",
      "Clean coils twice a year to maintain airflow."
    ]
  },

  // SHOPPING (12 actions)
  {
    id: "shop_01",
    title: "Buy Secondhand Clothing",
    description: "Choose thrift shops to skip garment manufacturing carbon.",
    category: "shopping",
    co2Savings: 110,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Find thrift shops or consignment stores nearby.",
      "Browse digital vintage reseller apps like Depop or Poshmark.",
      "Clean secondhand purchases thoroughly before wearing."
    ]
  },
  {
    id: "shop_02",
    title: "Practice the 30-Day Rule",
    description: "Wait 30 days before checkout to curb impulse shopping.",
    category: "shopping",
    co2Savings: 150,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Add non-essential items to a wishlist instead of buying.",
      "Review the wishlist item after 30 days.",
      "Delete if interest has faded; buy only if essential."
    ]
  },
  {
    id: "shop_03",
    title: "Choose Recycled Paper Goods",
    description: "Buy recycled paper towels, napkins, and toilet sheets.",
    category: "shopping",
    co2Savings: 30,
    difficulty: "easy",
    costImpact: "neutral",
    implementationSteps: [
      "Look for '100% Post-Consumer Recycled' labels.",
      "Avoid bleached white products that utilize chlorine.",
      "Switch to reusable cloth rags to replace paper towels."
    ]
  },
  {
    id: "shop_04",
    title: "Borrow or Rent Tools",
    description: "Share lawnmowers, drills, and camping gear instead of buying.",
    category: "shopping",
    co2Savings: 90,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Check out community tool libraries or neighbor circles.",
      "Rent specialty tools from hardware shops.",
      "Return items clean and in working order."
    ]
  },
  {
    id: "shop_05",
    title: "Buy in Bulk",
    description: "Reduce product packaging per gram of dry goods.",
    category: "shopping",
    co2Savings: 50,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Choose large bags of rice, flour, beans, and grains.",
      "Use glass jars at home for clean countertop storage.",
      "Avoid individually wrapped snack packs."
    ]
  },
  {
    id: "shop_06",
    title: "Repair Broken Items",
    description: "Fix torn seams, patch boots, and repair loose cables.",
    category: "shopping",
    co2Savings: 140,
    difficulty: "medium",
    costImpact: "saving",
    implementationSteps: [
      "Learn basic sewing stitches or visit a tailor.",
      "Take broken electronics to community repair cafes.",
      "Use specialty glues for loose soles or broken ceramic."
    ]
  },
  {
    id: "shop_07",
    title: "Eco-Friendly Cleaning Products",
    description: "Choose biodegradable soaps and vinegar cleaners.",
    category: "shopping",
    co2Savings: 40,
    difficulty: "easy",
    costImpact: "neutral",
    implementationSteps: [
      "Buy concentrated cleaner refills to save shipping weight.",
      "Make vinegar-and-water multi-surface sprays.",
      "Look for eco certifications like EPA Safer Choice."
    ]
  },
  {
    id: "shop_08",
    title: "Cancel Unnecessary Catalogs",
    description: "Stop junk mail delivery to save timber and printing.",
    category: "shopping",
    co2Savings: 10,
    difficulty: "easy",
    costImpact: "neutral",
    implementationSteps: [
      "Register on mailing opt-out sites (e.g. DMAchoice).",
      "Unsubscribe directly from promotional catalogs.",
      "Transition all bank statements to paperless PDF delivery."
    ]
  },
  {
    id: "shop_09",
    title: "Buy Durable Tech",
    description: "Extend smartphone and laptop upgrades to 4-5 years.",
    category: "shopping",
    co2Savings: 250,
    difficulty: "medium",
    costImpact: "saving",
    implementationSteps: [
      "Install software updates to maintain efficiency.",
      "Replace declining batteries instead of buying new devices.",
      "Invest in sturdy protective cases to prevent screen breaks."
    ]
  },
  {
    id: "shop_10",
    title: "Switch to Solid Soap Bars",
    description: "Replace bottled body washes with bar soaps.",
    category: "shopping",
    co2Savings: 30,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Buy unpackaged bar soap at grocery stores.",
      "Switch to solid shampoo and conditioner bars.",
      "Store bars on draining soap dishes to extend life."
    ]
  },
  {
    id: "shop_11",
    title: "Buy local artisan goods",
    description: "Support local makers to reduce shipping carbon.",
    category: "shopping",
    co2Savings: 60,
    difficulty: "easy",
    costImpact: "investment",
    implementationSteps: [
      "Shop craft fairs and local artisan directories.",
      "Choose hand-made furniture or goods built locally.",
      "Meet the creators to learn about materials used."
    ]
  },
  {
    id: "shop_12",
    title: "Opt out of Fast Shipping",
    description: "Choose ground consolidation shipping over 1-day air delivery.",
    category: "shopping",
    co2Savings: 80,
    difficulty: "easy",
    costImpact: "saving",
    implementationSteps: [
      "Select 'Standard' or 'Consolidated Delivery' at online checkouts.",
      "Order items together rather than in single units.",
      "Plan purchases in advance to avoid urgency."
    ]
  }
];
