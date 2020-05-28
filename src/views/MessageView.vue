<template>
<div class="messages-view">
  <div v-if="status=='success'">
    <div
      class="message-card bg-white margin-10 fc-black width-90 br-10 pd-10">
      <div class="sender-image" v-if="false">
        <div class="unread-dot bg-blue br-50" v-if="message.read==false"> </div>
        <img :src="message.sender.image" v-if="message.sender.image" />
        <div class="image-alternate bg-green fc-white fn-18 br-10" v-else >
          {{message.sender.first_name.charAt(0).toUpperCase()}}
        </div>
      </div>
      <div class="sender-name-block ">
        <div class="fn-16 fc-darkgrey ta-left fw-700  mb-0 margin-10">
          {{message.sender.first_name}} {{message.sender.last_name}}
        </div>
        <div class="fn-11 fc-grey ta-left fw-600 mt-0 margin-10">
          {{ message.modified_at | moment("Do MMM YY") | uppercase }}
          ({{ message.modified_at | moment("from") | uppercase }})
        </div>
      </div>
      <div class="grid-span-both-columns float-left fn-14 fc-bluegrey fw-700 margin-10">
        {{message_kind_label(message.kind)}}
      </div>
      <div class="grid-span-both-columns float-left width-90 message-content ta-left margin-10 fn-14 mt-0">
        {{message.content}}
      </div>
      <div class="float-left width-90 message-content ta-left fn-12 milife-button anchor-container">
        <a class="mailto pd-20"  :href="reply_mailto_url">Reply</a>
      </div>
    </div>

  </div>

</div>
</template>

<script>
export default {
    name: "MessageView",
    props: [],
    data() {
        return {
            message: {},
            status: "initial",
            search_keyword: "",
            kind_label: {
                "checkin-commentry": "Checkin Commentary",
                "weekly-commentry": "Weekly Commentary",
                "misc": "Miscellaneous",
            },

        }
    },
    components: {

    },
    computed: {
        is_admin: function() {
            return this.$store.state.auth.user.is_staff;
        },

        user: function() {
            if (this.fobj_user && this.is_admin) {
                return this.fobj_user;
            }
            else {
                return this.$store.state.auth.user;
            }
        },
        message_pk: function(){
            return this.$route.params.message_pk
        },

        messages_url: function() {
            return  process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + '/message/' + this.message_pk;
        },

        reply_mailto_url: function(){
            var sender = this.message.sender;
            var params = {

                to: sender.first_name + " " + sender.last_name + "<"+ sender.email +">",
                subject: this.user.first_name + " " + this.user.last_name + " | " + this.message.kind,
            }

            function serialize(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
            return "mailto:?"+serialize(params);
        },
    },

    methods: {
        fetch_message: function() {
            this.$http({url: this.messages_url, method: 'GET'})
                .then(resp => {
                    this.message = resp.data;
                    this.status="success";
                })
                .catch(err => {
                    this.status='error';
                });
        },
        mark_read: function(){
            if(this.is_admin || this.message.read){
                return;
            }
            this.$http({url: this.messages_url, method: 'PATCH', data: {read: true}})
                .then(resp => {
                    return;
                })
                .catch(err => {
                    this.status='error';
                });

        },
        message_kind_label: function(kind) {
            return this.kind_label[kind];
        },
    },

    filters: {
        uppercase: function(v) {
            return v.toUpperCase();
        }
    },

    created() {
        this.$store.dispatch("theme/set_theme_white");
    },
    mounted() {
        this.fetch_message();
        this.mark_read();
    },
}
</script>

<style lang="scss">
.messages-view{
    .message-card{
        /* display: grid; */
        /* height: 100px; */
        /* grid-template-columns: [column1-start] 1fr 9fr [column2-end]; */
        /* grid-template-rows: 2fr 1fr 1fr; */
        /* grid-row-gap: 5px; */
        /* grid-column-gap: 10px; */
        /* align-items: center; */
        height: 80%;
    }
    .sender-name-block{
        display: flex;
        flex-direction: column;
    }
    .grid-span-both-columns {
        grid-column: column1-start / column2-end;
        justify-self: start;
    }
    .message-content{
        align-self: center;
        font-weight: 500;
        color: lighten(#6F7C8E, 10%)
    }

    .red-border {
        border: 2px solid red;
    }
    .anchor-container {
        padding: 0;
        margin: 5%;
    }
    .mailto {
        display: block;
    }
    .mb-0 {
        margin-bottom: 0px;
    }
    .mt-0 {
        margin-top: 0px;
    }
    .fw-700 {
        font-weight: 700;
    }
}
</style>
