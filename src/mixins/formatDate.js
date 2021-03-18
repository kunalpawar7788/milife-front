import moment from "moment";

export default {
  methods: {
    formatDate (date_value, date_format="DD-MM-YYYY") {
      return moment(date_value).format(date_format);
    }
  }
}