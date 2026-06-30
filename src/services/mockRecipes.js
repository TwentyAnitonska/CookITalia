export const mockRecipes = [
  {
    id: 999001,
    title: "Bruschetta al Pomodoro",
    summary: "Classica bruschetta italiana con pomodori freschi, aglio, basilico e olio extravergine d'oliva. Un antipasto semplice, fresco e ricco di sapore mediterraneo.",
    image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?w=800",
    readyInMinutes: 15,
    preparationMinutes: 10,
    cookingMinutes: 5,
    servings: 4,
    pricePerServing: 80, // Low cost
    recipeTypeLabel: "Appetizer",
    dishTypes: ["appetizer", "antipasti", "starter"],
    cuisines: ["Italian"],
    origin: "Italy",
    dairyFree: true,
    vegan: true,
    vegetarian: true,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 150.5, unit: "kcal" }
      ]
    },
    extendedIngredients: [
      {
        id: 1,
        name: "pane rustico",
        original: "4 fette di pane rustico o toscano",
        nameClean: "pane",
        measures: { metric: { amount: 4, unitShort: "fette" } }
      },
      {
        id: 2,
        name: "pomodori maturi",
        original: "4 pomodori maturi (tipo ramato o perino)",
        nameClean: "pomodori",
        measures: { metric: { amount: 4, unitShort: "pz" } }
      },
      {
        id: 3,
        name: "aglio",
        original: "1 spicchio d'aglio",
        nameClean: "aglio",
        measures: { metric: { amount: 1, unitShort: "spicchio" } }
      },
      {
        id: 4,
        name: "basilico fresco",
        original: "1 mazzetto di basilico fresco",
        nameClean: "basilico",
        measures: { metric: { amount: 1, unitShort: "mazzetto" } }
      },
      {
        id: 5,
        name: "olio extravergine d'oliva",
        original: "3 cucchiai di olio extravergine d'oliva",
        nameClean: "olio d'oliva",
        measures: { metric: { amount: 3, unitShort: "cucchiai" } }
      },
      {
        id: 6,
        name: "sale e pepe",
        original: "un pizzico di sale e pepe nero",
        nameClean: "sale e pepe",
        measures: { metric: { amount: 1, unitShort: "pizzico" } }
      }
    ],
    analyzedInstructions: [
      {
        name: "Preparazione della Bruschetta",
        steps: [
          {
            number: 1,
            step: "Lavare i pomodori, tagliarli a cubetti piccoli e metterli in una ciotola.",
            ingredients: [{ id: 2, name: "pomodori" }]
          },
          {
            number: 2,
            step: "Condire i pomodori con l'olio extravergine d'oliva, sale, pepe e foglie di basilico spezzettate a mano. Mescolare e lasciare riposare per 10 minuti.",
            ingredients: [
              { id: 2, name: "pomodori" },
              { id: 4, name: "basilico" },
              { id: 5, name: "olio d'oliva" },
              { id: 6, name: "sale e pepe" }
            ]
          },
          {
            number: 3,
            step: "Abbrustolire le fette di pane su una piastra calda o nel forno fino a renderle dorate e croccanti su entrambi i lati.",
            ingredients: [{ id: 1, name: "pane" }]
          },
          {
            number: 4,
            step: "Strofinare leggermente lo spicchio d'aglio sbucciato sulla superficie delle fette di pane caldo.",
            ingredients: [
              { id: 1, name: "pane" },
              { id: 3, name: "aglio" }
            ]
          },
          {
            number: 5,
            step: "Distribuire i pomodori conditi sopra le fette di pane croccanti, aggiungendo un filo d'olio a crudo e altre foglie di basilico fresco per guarnire.",
            ingredients: [
              { id: 1, name: "pane" },
              { id: 2, name: "pomodori" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 999002,
    title: "Spaghetti alla Carbonara",
    summary: "Il celebre primo piatto romano a base di uova, guanciale, pecorino romano e pepe nero. Cremoso, saporito e fedele alla tradizione laziale.",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800",
    readyInMinutes: 25,
    preparationMinutes: 10,
    cookingMinutes: 15,
    servings: 4,
    pricePerServing: 180, // Medium cost
    recipeTypeLabel: "First Course",
    dishTypes: ["main course", "lunch", "pasta", "primi"],
    cuisines: ["Italian"],
    origin: "Rome, Italy",
    dairyFree: false,
    vegan: false,
    vegetarian: false,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 650.0, unit: "kcal" }
      ]
    },
    extendedIngredients: [
      {
        id: 11,
        name: "spaghetti",
        original: "320g di spaghetti",
        nameClean: "spaghetti",
        measures: { metric: { amount: 320, unitShort: "g" } }
      },
      {
        id: 12,
        name: "guanciale",
        original: "150g di guanciale tagliato a striscioline",
        nameClean: "guanciale",
        measures: { metric: { amount: 150, unitShort: "g" } }
      },
      {
        id: 13,
        name: "tuorli d'uovo",
        original: "4 tuorli d'uovo grandi",
        nameClean: "uovo",
        measures: { metric: { amount: 4, unitShort: "tuorli" } }
      },
      {
        id: 14,
        name: "pecorino romano",
        original: "50g di Pecorino Romano grattugiato",
        nameClean: "pecorino",
        measures: { metric: { amount: 50, unitShort: "g" } }
      },
      {
        id: 15,
        name: "pepe nero",
        original: "pepe nero macinato fresco q.b.",
        nameClean: "pepe nero",
        measures: { metric: { amount: 1, unitShort: "pizzico" } }
      }
    ],
    analyzedInstructions: [
      {
        name: "Preparazione della Carbonara",
        steps: [
          {
            number: 1,
            step: "Mettere a bollire una pentola capiente con acqua salata per cuocere gli spaghetti.",
            ingredients: []
          },
          {
            number: 2,
            step: "In una padella a fuoco medio, far rosolare il guanciale senza aggiungere altri grassi fino a quando non diventa croccante e il grasso si è sciolto. Mettere da parte il guanciale tenendo il suo grasso nella padella.",
            ingredients: [{ id: 12, name: "guanciale" }]
          },
          {
            number: 3,
            step: "In una ciotola, sbattere i tuorli d'uovo con il pecorino romano e una generosa dose di pepe nero macinato fresco fino ad ottenere una crema densa (il 'pastello').",
            ingredients: [
              { id: 13, name: "uovo" },
              { id: 14, name: "pecorino" },
              { id: 15, name: "pepe nero" }
            ]
          },
          {
            number: 4,
            step: "Cuocere gli spaghetti nell'acqua bollente. Scolarli al dente tenendo da parte un bicchiere di acqua di cottura della pasta.",
            ingredients: [{ id: 11, name: "spaghetti" }]
          },
          {
            number: 5,
            step: "Versare gli spaghetti nella padella con il grasso del guanciale caldo e saltarli a fuoco spento per qualche istante.",
            ingredients: [
              { id: 11, name: "spaghetti" },
              { id: 12, name: "guanciale" }
            ]
          },
          {
            number: 6,
            step: "Aggiungere la crema di uova e pecorino alla pasta. Mescolare rapidamente aggiungendo poca acqua di cottura se necessario per creare un'emulsione setosa e super cremoso. Unire infine il guanciale croccante.",
            ingredients: [
              { id: 11, name: "spaghetti" },
              { id: 13, name: "uovo" },
              { id: 14, name: "pecorino" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 999003,
    title: "Parmigiana di Melanzane",
    summary: "Una delle ricette più amate del sud Italia, composta da strati di melanzane fritte, salsa di pomodoro profumata al basilico, mozzarella fresca e abbondante Parmigiano-Reggiano.",
    image: "https://images.unsplash.com/photo-1579631542720-3a87824ffd8e?w=800",
    readyInMinutes: 50,
    preparationMinutes: 20,
    cookingMinutes: 30,
    servings: 6,
    pricePerServing: 250, // Medium/High cost
    recipeTypeLabel: "Main Course",
    dishTypes: ["main course", "dinner", "secondi"],
    cuisines: ["Italian"],
    origin: "Sicily / Campania, Italy",
    dairyFree: false,
    vegan: false,
    vegetarian: true,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 420.0, unit: "kcal" }
      ]
    },
    extendedIngredients: [
      {
        id: 21,
        name: "melanzane",
        original: "1.2kg di melanzane ovali nere",
        nameClean: "melanzane",
        measures: { metric: { amount: 1200, unitShort: "g" } }
      },
      {
        id: 22,
        name: "passata di pomodoro",
        original: "700ml di passata di pomodoro di alta qualità",
        nameClean: "passata pomodoro",
        measures: { metric: { amount: 700, unitShort: "ml" } }
      },
      {
        id: 23,
        name: "mozzarella fior di latte",
        original: "350g di mozzarella fresca sgocciolata",
        nameClean: "mozzarella",
        measures: { metric: { amount: 350, unitShort: "g" } }
      },
      {
        id: 24,
        name: "parmigiano reggiano",
        original: "80g di Parmigiano Reggiano grattugiato",
        nameClean: "parmigiano",
        measures: { metric: { amount: 80, unitShort: "g" } }
      },
      {
        id: 25,
        name: "basilico fresco",
        original: "1 mazzetto di basilico",
        nameClean: "basilico",
        measures: { metric: { amount: 1, unitShort: "mazzetto" } }
      },
      {
        id: 26,
        name: "cipolla e aglio",
        original: "1/2 cipolla tritata e 1 spicchio d'aglio",
        nameClean: "cipolla",
        measures: { metric: { amount: 1, unitShort: "pz" } }
      },
      {
        id: 27,
        name: "olio per friggere",
        original: "olio di semi di arachidi per friggere q.b.",
        nameClean: "olio",
        measures: { metric: { amount: 1, unitShort: "q.b." } }
      }
    ],
    analyzedInstructions: [
      {
        name: "Preparazione della Parmigiana",
        steps: [
          {
            number: 1,
            step: "Tagliare le melanzane a fette di circa 5mm di spessore. Disporle a strati in un colino cosparse di sale grosso per far rilasciare l'acqua amara per circa 1 ora, poi sciacquarle e asciugarle bene.",
            ingredients: [{ id: 21, name: "melanzane" }]
          },
          {
            number: 2,
            step: "Preparare il sugo: far soffriggere cipolla e aglio in un filo d'olio d'oliva, aggiungere la passata di pomodoro, sale e qualche foglia di basilico. Cuocere a fuoco lento per circa 20 minuti.",
            ingredients: [
              { id: 22, name: "passata pomodoro" },
              { id: 25, name: "basilico" },
              { id: 26, name: "cipolla" }
            ]
          },
          {
            number: 3,
            step: "Friggere le fette di melanzane in abbondante olio di semi bollente fino a quando sono dorate su entrambi i lati. Scolarle su carta assorbente.",
            ingredients: [
              { id: 21, name: "melanzane" },
              { id: 27, name: "olio" }
            ]
          },
          {
            number: 4,
            step: "In una pirofila da forno, spalmare sul fondo un velo di sugo. Creare un primo strato di melanzane, coprire con altro sugo, mozzarella a dadini, foglie di basilico e una spolverata generosa di parmigiano.",
            ingredients: [
              { id: 21, name: "melanzane" },
              { id: 22, name: "passata pomodoro" },
              { id: 23, name: "mozzarella" },
              { id: 24, name: "parmigiano" }
            ]
          },
          {
            number: 5,
            step: "Ripetere gli strati fino a esaurimento degli ingredienti, terminando con uno strato di pomodoro, mozzarella e abbondante parmigiano.",
            ingredients: [
              { id: 21, name: "melanzane" },
              { id: 23, name: "mozzarella" },
              { id: 24, name: "parmigiano" }
            ]
          },
          {
            number: 6,
            step: "Infornare in forno preriscaldato a 200°C per circa 25-30 minuti, finché non si forma una bella crosticina dorata in superficie. Lasciare riposare 10-15 minuti prima di servire.",
            ingredients: []
          }
        ]
      }
    ]
  },
  {
    id: 999004,
    title: "Insalata Caprese",
    summary: "Il contorno estivo per eccellenza originario dell'isola di Capri. Pochi e freschissimi ingredienti che ricreano i colori della bandiera italiana: mozzarella, pomodoro e basilico.",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=800",
    readyInMinutes: 10,
    preparationMinutes: 10,
    cookingMinutes: 0,
    servings: 2,
    pricePerServing: 110, // Low/Medium cost
    recipeTypeLabel: "Side Dish",
    dishTypes: ["side dish", "salad", "contorni"],
    cuisines: ["Italian"],
    origin: "Capri, Italy",
    dairyFree: false,
    vegan: false,
    vegetarian: true,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 280.0, unit: "kcal" }
      ]
    },
    extendedIngredients: [
      {
        id: 31,
        name: "mozzarella di bufala",
        original: "250g di Mozzarella di Bufala Campana o fiordilatte",
        nameClean: "mozzarella",
        measures: { metric: { amount: 250, unitShort: "g" } }
      },
      {
        id: 32,
        name: "pomodori maturi",
        original: "3 pomodori grandi maturi (tipo Cuore di bue o San Marzano)",
        nameClean: "pomodori",
        measures: { metric: { amount: 3, unitShort: "pz" } }
      },
      {
        id: 33,
        name: "basilico fresco",
        original: "abbondanti foglie di basilico fresco",
        nameClean: "basilico",
        measures: { metric: { amount: 1, unitShort: "mazzetto" } }
      },
      {
        id: 34,
        name: "olio extravergine d'oliva",
        original: "olio extravergine d'oliva spremuto a freddo q.b.",
        nameClean: "olio d'oliva",
        measures: { metric: { amount: 2, unitShort: "cucchiai" } }
      },
      {
        id: 35,
        name: "sale e origano",
        original: "un pizzico di sale e origano secco (opzionale)",
        nameClean: "sale",
        measures: { metric: { amount: 1, unitShort: "pizzico" } }
      }
    ],
    analyzedInstructions: [
      {
        name: "Preparazione dell'Insalata Caprese",
        steps: [
          {
            number: 1,
            step: "Lavare i pomodori e tagliarli a fette regolari di circa 1 cm di spessore.",
            ingredients: [{ id: 32, name: "pomodori" }]
          },
          {
            number: 2,
            step: "Affettare la mozzarella di bufala allo stesso spessore delle fette di pomodoro.",
            ingredients: [{ id: 31, name: "mozzarella" }]
          },
          {
            number: 3,
            step: "Disporre le fette di pomodoro e di mozzarella su un piatto da portata alternandole in modo ordinato.",
            ingredients: [
              { id: 31, name: "mozzarella" },
              { id: 32, name: "pomodori" }
            ]
          },
          {
            number: 4,
            step: "Distribuire le foglie di basilico fresco tra una fetta e l'altra.",
            ingredients: [{ id: 33, name: "basilico" }]
          },
          {
            number: 5,
            step: "Condire il tutto con un pizzico di sale, una spolverata opzionale di origano secco e abbondante olio extravergine d'oliva a filo prima di servire.",
            ingredients: [
              { id: 34, name: "olio d'oliva" },
              { id: 35, name: "sale" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 999005,
    title: "Tiramisù Classico",
    summary: "Il dolce italiano più famoso al mondo. Strati di savoiardi inzuppati nel caffè espresso alternati a una soffice crema al mascarpone e cosparsi di cacao amaro in polvere.",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800",
    readyInMinutes: 30,
    preparationMinutes: 30,
    cookingMinutes: 0,
    servings: 8,
    pricePerServing: 150, // Medium cost
    recipeTypeLabel: "Dessert",
    dishTypes: ["dessert", "sweet", "dolci"],
    cuisines: ["Italian"],
    origin: "Treviso, Italy",
    dairyFree: false,
    vegan: false,
    vegetarian: true,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 480.0, unit: "kcal" }
      ]
    },
    extendedIngredients: [
      {
        id: 41,
        name: "mascarpone",
        original: "500g di mascarpone fresco",
        nameClean: "mascarpone",
        measures: { metric: { amount: 500, unitShort: "g" } }
      },
      {
        id: 42,
        name: "savoiardi",
        original: "300g di biscotti savoiardi",
        nameClean: "savoiardi",
        measures: { metric: { amount: 300, unitShort: "g" } }
      },
      {
        id: 43,
        name: "uova fresche",
        original: "4 uova medie freschissime (separando tuorli e albumi)",
        nameClean: "uovo",
        measures: { metric: { amount: 4, unitShort: "pz" } }
      },
      {
        id: 44,
        name: "zucchero",
        original: "100g di zucchero semolato",
        nameClean: "zucchero",
        measures: { metric: { amount: 100, unitShort: "g" } }
      },
      {
        id: 45,
        name: "caffè",
        original: "300ml di caffè espresso non zuccherato freddo",
        nameClean: "caffè",
        measures: { metric: { amount: 300, unitShort: "ml" } }
      },
      {
        id: 46,
        name: "cacao amaro",
        original: "cacao amaro in polvere per spolverare q.b.",
        nameClean: "cacao",
        measures: { metric: { amount: 1, unitShort: "q.b." } }
      }
    ],
    analyzedInstructions: [
      {
        name: "Preparazione del Tiramisù",
        steps: [
          {
            number: 1,
            step: "Preparare il caffè espresso e lasciarlo raffreddare completamente in una ciotola piana.",
            ingredients: [{ id: 45, name: "caffè" }]
          },
          {
            number: 2,
            step: "In una ciotola, montare a lungo i tuorli d'uovo con lo zucchero semolato con le fruste elettriche fino a ottenere un composto chiaro e spumoso.",
            ingredients: [
              { id: 43, name: "uovo" },
              { id: 44, name: "zucchero" }
            ]
          },
          {
            number: 3,
            step: "Lavorare leggermente il mascarpone con un cucchiaio, poi unirlo delicatamente al composto di tuorli e zucchero.",
            ingredients: [
              { id: 41, name: "mascarpone" },
              { id: 43, name: "uovo" }
            ]
          },
          {
            number: 4,
            step: "Montare a neve fermissima gli albumi e incorporarli poco alla volta alla crema di mascarpone, mescolando dal basso verso l'alto per non smontarli.",
            ingredients: [{ id: 43, name: "uovo" }]
          },
          {
            number: 5,
            step: "Inzuppare rapidamente i savoiardi nel caffè, senza bagnarli troppo, e disporli ordinatamente sul fondo di una pirofila rettangolare.",
            ingredients: [
              { id: 42, name: "savoiardi" },
              { id: 45, name: "caffè" }
            ]
          },
          {
            number: 6,
            step: "Coprire lo strato di biscotti con metà della crema al mascarpone livellandola bene. Fare un secondo strato di savoiardi imbevuti e coprire con la crema rimanente.",
            ingredients: [
              { id: 42, name: "savoiardi" }
            ]
          },
          {
            number: 7,
            step: "Spolverare la superficie del tiramisù con un velo abbondante e uniforme di cacao amaro in polvere. Mettere in frigorifero a riposare per almeno 3 ore prima di servire.",
            ingredients: [{ id: 46, name: "cacao" }]
          }
        ]
      }
    ]
  }
];
