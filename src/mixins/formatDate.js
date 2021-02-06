import moment from "moment";

export default {
  methods: {
    backEndDateFormat (date_value, date_format="YYYY-MM-DD") {
      if (!date_value) return ''
      return moment(date_value).format(date_format);
    }
  }
}