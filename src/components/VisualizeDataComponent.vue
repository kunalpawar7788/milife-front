<template>
  <div>
    <select v-model="selected">
      <option disabled value="">Please select one</option>
      <option
        v-for="(option, index) in options"
        :key="index"
        v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>

    <div class="graph-container">
      <div v-if="selected === 'weight'">
        <MiniWeightChart
          :height="300"
          :width="300"
          :weight_log="weightData.weight_log"
          :target_weights="weightData.target_weight"
          :show_axes="true"
        />
      </div>
      <div v-else>
        <GenericChart
          :datapoints="dataToPlot"
          :field="{ label: selected, value: selected }"
          :key="plotKey"
        />
      </div>
    </div>

    <div class="table-container">
      <table v-if="selected === 'weight'">
        <tr>
          <th>Date</th>
          <th>Weight</th>
          <th>Target Weight</th>
        </tr>
        <tr
          v-for="(date, index) in weightDates"
          :key="index"
        >
          <td>{{ date | moment('DD-MM-YYYY') }}</td>
          <td>{{ processedWeightData.weight_log[date] || "-" }}</td>
          <td>{{ processedWeightData.target_weight[date] || "-" }}</td>
        </tr>
      </table>

      <table v-else-if="selected">
        <tr>
          <th>Date</th>
          <th>Value</th>
        </tr>
        <tr
          v-for="(data, index) in dataToPlot"
          :key="index"
        >
          <td>{{ data.date | moment('DD-MM-YYYY') }}</td>
          <td>{{ data.value }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import GenericChart from "@/components/progress-chart/GenericChart.vue";
import MiniWeightChart from "@/components/MiniWeightChart.vue";
import moment from "moment";
import formatDate from "@/mixins/formatDate.js";

export default {
  name: "VisualizeDataComponent",
  props: ["fobj_user"],
  components: { GenericChart, MiniWeightChart },
  mixins: [formatDate],
  data() {
    return {
      selected: "",
      checkinData: {},
      weightData: {},
      processedWeightData: {},
      weightDates: [],
      plotKey: 0,
      options: [
        { text: "Body Fat", value: "body_fat" },
        { text: "Body Fat %", value: "percentage_body_fat" },
        { text: "Muscle Mass", value: "muscle_mass" },
        { text: "Muscle Mass %", value: "percentage_muscle_mass" },
        { text: "Visceral Fat Mass", value: "visceral_fat_mass" },
        { text: "Body Type", value: "body_type" },
        { text: "Biological Age", value: "biological_age" },

        { text: "Body Mass Index", value: "body_mass_index" },
        { text: "Waist/Hip Ratio", value: "waist_hip_ratio" },
        { text: "Systolic Blood Pressure", value: "systolic_blood_pressure" },
        { text: "Diastolic Blood Pressure", value: "diastolic_blood_pressure" },
        { text: "Blood Sugar", value: "blood_sugar" },
        { text: "VO2Max", value: "vo2_max" },
        { text: "Resting Heart Rate", value: "resting_heart_rate" },

        { text: "Waist", value: "waist" },
        { text: "Hips", value: "hips" },
        { text: "Chest", value: "chest" },
        { text: "Shoulders", value: "shoulders" },
        { text: "Left Arm", value: "left_arm" },
        { text: "Right Arm", value: "right_arm" },
        { text: "Left Leg", value: "left_leg" },
        { text: "Right Leg", value: "right_leg" },
        { text: "Weight", value: "weight" },
      ],
    };
  },

  mounted() {
    this.fetchCheckinData();
    this.fetchWeightData();
  },

  computed: {
    user: function() {
      var user = Object.assign({}, this.$store.state.auth.user);

      if (this.$route.params.pk) {
        user = Object.assign({}, this.fobj_user);
      }

      return user;
    },

    dataToPlot: function() {
      var data = [];
      this.plotKey += 1;

      if (!this.selected) {
        return data;
      }

      for (var idx in this.checkinData) {
        let checkin = this.checkinData[idx];
        data.push({
          date: this.backEndDateFormat(checkin["date_of_checkin"]),
          value: checkin[this.selected],
        });
      }

      return this.$_.sortBy(data, "date");
    },
  },

  methods: {
    processWeightData: function() {
      var dates = [];
      var weightLog = this.weightData.weight_log;
      var targetWeight = this.weightData.target_weight;
      var newWeightData = { weight_log: {}, target_weight: {} };

      for (let idx in weightLog) {
        let date = weightLog[idx]["measured_on"];

        dates.push(date);
        newWeightData.weight_log[date] = weightLog[idx]["weight"];
      }

      for (let idx in targetWeight) {
        let date = targetWeight[idx]["target_date"];

        if (!dates.includes(date)) dates.push(date);
        newWeightData.target_weight[date] = targetWeight[idx]["target_weight"];
      }

      dates.sort();
      this.weightDates = dates;
      this.processedWeightData = newWeightData;
    },
    fetchCheckinData: function() {
      const url =
        process.env.VUE_APP_BASE_URL +
        "/api/users/" +
        this.user.id +
        "/progress-report";

      this.$http({ url: url, method: "GET", params: { deleted: false } }).then(
        (resp) => {
          this.checkinData = resp.data.results;
        }
      );
    },
    fetchWeightData: function() {
      const url =
        process.env.VUE_APP_BASE_URL +
        "/api/users/" +
        this.user.id +
        "/weight-chart";

      this.$http({ url: url, method: "GET" })
        .then((resp) => {
          this.weightData = resp.data;
        })
        .then(this.processWeightData);
    }
  },
};
</script>

<style lang="scss">
table {
  width: 100%;
}

th {
  border-bottom: 1px solid white;
  border-right: 1px solid white;
}

.table-container {
  overflow-x: auto;
  height: 15em;
  margin-top: 2em;
  border: 1px solid white;
}

.graph-container {
  div#meh {
    height: 20em;
  }
}
</style>
