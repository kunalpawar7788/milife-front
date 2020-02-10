import lodash from 'lodash';

var get_element_from_list_by_range = function(list, delimiters, value) {
    let list_delimiters_zip = list.map((k,i) => [k, delimiters[i]]);

    // get values higher than
    let filtered = list_delimiters_zip.filter((tuple, index) => {
        return tuple[1] < value;
    });
    return filtered[filtered.length -1][0];

};

var body_mass_index = {
    classes: ["underweight", "healthy", "above-ideal", "obese"],
    delimiters: [10, 18.5, 71, 81],

    classify: function(value, age, gender){
        return get_element_from_list_by_range(this.classes, this.delimiters, value);
    },
};


var cholesterol = {
    categories: [
        {name: "desirable", range: {min: 140, max: 200}},
        {name: "borderline", range: {min: 200, max: 240}},
        {name: "high", range: {min: 340, max: 350}},
    ],
    classify: function(value, age, gender){
        let category_name = null;
        this.categories.forEach(function(category){
            if (value >= category.range.min && value < category.range.max){
                category_name = category.name;
            }
        }.bind(this));
        return category_name;
    }
};


var waist_hip_ratio = {
    categories: [
        {gender: "M", name: "normal", range: { min: 0, max: 0.9} },
        {gender: "M", name: "overweight", range: { min: 0.9, max: 0.99}},
        {gender: "M", name: "obese", range: { min: 0.99, max: 1}},

        {gender: "F", name: "normal", range: { min: 0, max: 0.8}},
        {gender: "F", name: "overweight", range: { min: 0.8, max: 0.84}},
        {gender: "F", name: "obese", range: { min: 0.84, max: 1}}

    ],
    classify: function(value, age, gender){
        let category_name = null;
        this.categories.forEach(function(category){
            if (value >= category.range.min && value < category.range.max && gender == category.gender){
                category_name = category.name;
            }
        }.bind(this));
        return category_name;
    }
};

var body_fat = {
    categories: [
        {gender: "M", name: "essential-fat", range: { min: 1, max: 6}},
        {gender: "M", name: "athelete", range: { min: 6, max: 13}},
        {gender: "M", name: "fitness", range: { min: 13, max: 17}},
        {gender: "M", name: "average", range: { min: 17, max: 22}},
        {gender: "M", name: "overweight", range: { min: 22, max: 30}},
        {gender: "M", name: "obese", range: { min: 30, max: 50}},

        {gender: "F", name: "essential-fat", range: { min: 1, max: 14}},
        {gender: "F", name: "athelete", range: { min: 14, max: 21}},
        {gender: "F", name: "fitness", range: { min: 21, max: 25}},
        {gender: "F", name: "average", range: { min: 25, max: 31}},
        {gender: "F", name: "overweight", range: { min: 31, max: 40}},
        {gender: "F", name: "obese", range: { min: 40, max: 50}}

    ],

    classify: function(value, age, gender){
        let category_name = null;
        this.categories.forEach(function(category){
            if (value >= category.range.min && value < category.range.max && gender == category.gender){
                category_name = category.name;
            }
        }.bind(this));
        return category_name;
    }
};

var systolic_blood_pressure = {
    categories: [
        {name: "low", range: { min: 50, max: 90}},
        {name: "ideal", range: { min: 90, max: 120}},
        {name: "pre-high", range: { min: 120, max: 140}},
        {name: "high", range: { min: 140, max: 200}},
    ],
    classify: function(value, age, gender){
        let category_name = null;
        this.categories.forEach(function(category){
            if (value >= category.range.min && value < category.range.max){
                category_name = category.name;
            }
        }.bind(this));
        return category_name;
    }
};


var diastolic_blood_pressure = {
    categories: [
        {name: "low", range: { min: 30, max: 60}},
        {name: "ideal", range: { min: 60, max: 80}},
        {name: "pre-high", range: { min: 80, max: 90}},
        {name: "high", range: { min: 90, max: 110}},
    ],
    classify: function(value, age, gender){
        let category_name = null;
        this.categories.forEach(function(category){
            if (value >= category.range.min && value < category.range.max){
                category_name = category.name;
            }
        }.bind(this));
        return category_name;
    }
};



var resting_heart_rate = {
    age_delimiters: [18, 26, 36, 46, 56, 65],
    classes: ["athlete", "excellent", "good", "above-average", "average", "below-average", "poor"],

    class_delimiters_by_gender: {
        'F': [
            [54, 61, 66, 70, 74, 79, 85],
            [54, 60, 65, 69, 73, 77, 83],
            [54, 60, 65, 70, 74, 79, 85],
            [54, 61, 66, 70, 74, 78, 84],
            [54, 60, 65, 69, 74, 78, 84],
            [54, 60, 65, 69, 73, 77, 84]
        ],
        'M': [
            [49, 56, 62, 66, 70, 74, 81],
            [49, 55, 62, 66, 71, 75, 82],
            [50, 57, 63, 67, 71, 76, 83],
            [50, 58, 64, 68, 72, 77, 84],
            [51, 57, 62, 68, 72, 76, 82],
            [50, 56, 62, 66, 70, 74, 80]
        ]
    },

    get_element_from_list_by_range: function(list, delimiters, value) {
        let list_delimiters_zip = list.map((k,i) => [k, delimiters[i]]);

        // get values higher than
        let filtered = list_delimiters_zip.filter((tuple, index) => {
            return tuple[1] <= value;
        });
        return filtered[filtered.length -1][0];

    },

    _get_classification_delimiters: function(gender, age){

        // delimiters from gender
        let list_of_classification_delimiters = this.class_delimiters_by_gender[gender];

        return this.get_element_from_list_by_range(
            list_of_classification_delimiters, this.age_delimiters, age);

    },

    classify: function(value, age, gender){
        let classification_delimiters = this._get_classification_delimiters(gender, age);
        console.log(classification_delimiters)
        return this.get_element_from_list_by_range(this.classes, classification_delimiters, value);
    },
};



var vo2max = {
    classes: ["very-poor", 'poor', 'below-average', 'average', 'above-average', 'good', 'excellent'],
    age_delimiters: [18, 26, 36, 46, 57, 66],

    class_delimiters_by_gender: {
        'F': [
            [0, 28, 33, 38, 42, 47, 56],
            [0, 26, 31, 35, 39, 45, 52],
            [0, 22, 27, 31, 34, 38, 45],
            [0, 20, 25, 28, 31, 34, 40],
            [0, 18, 22, 25, 28, 32, 37],
            [0, 17, 19, 22, 25, 28, 32],
        ],
        'M': [
            [0, 30, 37, 42, 57, 52, 60],
            [0, 30, 35, 40, 43, 49, 56],
            [0, 26, 31, 35, 39, 43, 51],
            [0, 25, 29, 32, 36, 39, 45],
            [0, 22, 26, 30, 32, 36, 41],
            [0, 20, 22, 26, 29, 33, 37],
        ]
    },

    get_element_from_list_by_range: function(list, delimiters, value) {
        let list_delimiters_zip = list.map((k,i) => [k, delimiters[i]]);

        // get values higher than
        let filtered = list_delimiters_zip.filter((tuple, index) => {
            return tuple[1] <= value;
        });
        return filtered[filtered.length -1][0];

    },

    _get_classification_delimiters: function(gender, age){

        // delimiters from gender
        let list_of_classification_delimiters = this.class_delimiters_by_gender[gender];

        return this.get_element_from_list_by_range(
            list_of_classification_delimiters, this.age_delimiters, age);

    },

    classify: function(value, age, gender){
        let classification_delimiters = this._get_classification_delimiters(gender, age);
        console.log(classification_delimiters)
        return this.get_element_from_list_by_range(this.classes, classification_delimiters, value);
    },
};



export default function(name, value, age, gender){
    let d = {
        "body_mass_index": body_mass_index,
        "cholesterol": cholesterol,
        "vo2max": vo2max,
        "systolic_blood_pressure": systolic_blood_pressure,
        "diastolic_blood_pressure": diastolic_blood_pressure,
        "waist_hip_ratio": waist_hip_ratio,
        "body_fat": body_fat,
        "resting_heart_rate": resting_heart_rate,
    };
    var f = d[name];

    try {
        return f.classify(value, age, gender);
    }
    catch {
        console.log('couldn not find', name);
    }
    return '';
};
