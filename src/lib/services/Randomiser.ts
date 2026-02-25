export interface FoodMenuData {
    rice: {
        wokstation: {
            prefix: string[];
            meat: string[];
            suffix: string[];
            toppings: string[];
        };
        eggs: {
            method: string[];
            meat: string[];
        };
        others: string[];
    };
    noodles: {
        type: string[];
        others: string[];
    };
    soup: string[];
    others: string[];
}

export interface DrinksMenuData {
    coffee: string[];
    tea: string[];
    juice: string[];
    soda: string[];
    alcohol: string[];
}

export class Randomiser {
    private static readonly FORBIDDEN_REGEX = /(หมู)|(แฮม)|(เล้ง)|(ลาบ)|(น้ำตก)/;

    private static getRandomItem(arr: string[]): string {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    private static generateRice(data: FoodMenuData): string {
        const subCategory = Math.floor(Math.random() * 3);
        let reply = 'ข้าว';

        switch (subCategory) {
            case 0: // Wok Station
                {
                    const style = Math.floor(Math.random() * 2);
                    if (style === 0) { // With Prefix
                        // Wok Station: Type 1: Prefix + Meat + Topping
                        reply += Randomiser.getRandomItem(data.rice.wokstation.prefix);
                        reply += Randomiser.getRandomItem(data.rice.wokstation.meat);
                    } else { // With Suffix
                        // Wok Station: Type 2: Meat + Suffix + Topping
                        reply += Randomiser.getRandomItem(data.rice.wokstation.meat);
                        reply += Randomiser.getRandomItem(data.rice.wokstation.suffix);
                    }
                    reply += Randomiser.getRandomItem(data.rice.wokstation.toppings);
                    break;
                }
            case 1: // Eggs
                // Eggs: Method + Meat
                reply += Randomiser.getRandomItem(data.rice.eggs.method);
                reply += Randomiser.getRandomItem(data.rice.eggs.meat);
                break;
            case 2: // Others
                // Others: Just random item from list, appends to 'ข้าว'
                // Note: PHP code appends to 'ข้าว', e.g. 'ข้าว' + 'ขาหมู' = 'ข้าวขาหมู'
                reply += Randomiser.getRandomItem(data.rice.others);
                break;
        }
        return reply;
    }

    private static generateNoodles(data: FoodMenuData): string {
        const subCategory = Math.floor(Math.random() * 2);

        if (subCategory === 0) { // Type
            // Type: 'ก๋วยเตี๋ยว' + Type
            let reply = 'ก๋วยเตี๋ยว';
            reply += Randomiser.getRandomItem(data.noodles.type);
            return reply;
        } else { // Others
            // Others: Random item from list (replaces 'ก๋วยเตี๋ยว')
            // PHP logic: $reply = $list->noodles->others[...]
            return Randomiser.getRandomItem(data.noodles.others);
        }
    }

    public static getFoodMenu(data: FoodMenuData, category: number, halal: boolean = false): string {
        let reply = '';

        // If category is 0 or out of range, we might want to randomize category first?
        // The PHP function takes a category as input.
        // If category is not 1-4, it returns error.
        // However, typically a "randomiser" might also pick a category if one isn't provided.
        // But I will stick to the signature `getFood(list, category, halal)`.

        switch (category) {
            case 1: // Rice
                reply = Randomiser.generateRice(data);
                break;
            case 2: // Noodles
                reply = Randomiser.generateNoodles(data);
                break;
            case 3: // Soup
                reply = Randomiser.getRandomItem(data.soup);
                break;
            case 4: // Others
                reply = Randomiser.getRandomItem(data.others);
                break;
            default:
                return 'Error: Category is invalid';
        }

        if (halal && Randomiser.FORBIDDEN_REGEX.test(reply)) {
            // Recursively try again
            return Randomiser.getFoodMenu(data, category, halal);
        }

        return reply;
    }

	public static getDrinksMenu(data: DrinksMenuData, category: number): string {
		switch (category) {
			case 1: // Coffee
				return Randomiser.getRandomItem(data.coffee);
			case 2: // Tea
				return Randomiser.getRandomItem(data.tea);
			case 3: // Juice
				return Randomiser.getRandomItem(data.juice);
			case 4: // Soda
				return Randomiser.getRandomItem(data.soda);
			case 5: // Alcohol
				return Randomiser.getRandomItem(data.alcohol);
			default:
				return 'Error: Category is invalid';
		}
	}
}
