<template>
<section class="compose-message-container">
  <SelectedUserDisplay class="" :fobj_user="fobj_user"> </SelectedUserDisplay>
  <multiselect
    v-model="message_kind"
    placeholder="Message Type"
    :options="message_kind_options"
    label="label"
    track-by="value"
    >
  </multiselect>
  <textarea v-model="data.content" rows="10"> </textarea>
  <button class="button" v-on:click="send_message"> Send </button>
</section>

</template>
<script>
import SelectedUserDisplay from '@/components/SelectedUserDisplay';
import Multiselect from 'vue-multiselect';
export default {
    components: {SelectedUserDisplay, Multiselect},
    props: ['fobj_user', ],
    name: "ComposeMessage",
    data() {
        return {
            message_kind_options: [
                {'label': 'Miscellaneous', value:"misc"},
                {'label': 'Weekly Commentry', value: "weekly-commentry"},
            ],
            data: {
                kind: "",
                content: "",
            },
        };
    },
    computed: {
        user_pk() {
            return this.$route.params.pk;
        },

        message_kind_options_d(){
            var d = {};
            for(var i=0; i < this.message_kind_options.length; i++) {
                console.log(i, this.message_kind_options[i])
                d[this.message_kind_options[i]['value']] = this.message_kind_options[i];
            }
            return d;
        },
        message_kind: {
            get() {
                var val = this.data.kind;
                return this.message_kind_options_d[val];
            },
            set(value) {
                var d = Object.assign({}, value);
                this.data.kind = d['value'];
            },
        },

    },
    methods: {
        send_message: function(){
            return new Promise((resolve, reject) => {
                const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk + "/message";
                var data = this.data;

                this.$http({url: url, method: "POST", data: this.data})
                    .then(resp => {
                        resolve(resp);
                        this.$router.go('-1');

                    })
                    .catch(err => {
                        this.status='error';
                        console.log(err);
                        reject(err);
                    });
            });


        },
    },
}
</script>

<style lang="scss">
section.compose-message-container {
     textarea {
        width: 80%;
        border-radius:20px;
        padding: 10px;
        margin: 10px;
    }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
