<template>
<div class="messages-list-view">
  <input
    class="text-input search-box width-80"
    v-model="search_keyword"
    placeholder="Start typing to search"
    v-on:keyup="fetch_messages">
  <div v-if="status=='success'">
    <div
      class="message-card bg-white margin-10 fc-black width-90 br-10 pd-10"
      v-for="(message, index) in display_messages"
      :key="index"
      v-on:click="goto_view_message(message.id)"
      >
      <div class="sender-image">
        <div class="unread-dot bg-blue br-50" v-if="message.read==false"> </div>
        <img :src="message.sender.image" v-if="message.sender.image" />
        <div class="image-alternate bg-green fc-white fn-18 br-10" v-else >
          {{message.sender.first_name.charAt(0).toUpperCase()}}
        </div>
      </div>
      <div class="sender-name-block">
        <div class="fn-14 fc-lightblack fw-700 ta-left">
          {{message.sender.first_name}} {{message.sender.last_name}}
        </div>
        <span class="fn-11 fc-grey fw-500 ta-left">
          {{ message.created_at | moment("Do MMM YY") | uppercase }}
          ({{ message.created_at | moment('from') | uppercase }})
        </span>
      </div>
      <div class="grid-span-both-columns float-left fc-bluegrey fw-700">{{message_kind_label(message.kind)}}</div>
      <div class="grid-span-both-columns float-left fc-bluegrey overflow-ellipsis width-90 message-content">
        {{message.content}}
      </div>
    </div>
  </div>

</div>
</template>

<script>
import moment from 'moment';
export default {
    name: "MessageListView",
    props: [],
    data() {
        return {
            messages: {},
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
        messages_url: function() {
            return  process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + '/message';
        },

        display_messages: function() {
            return this.$_.filter(this.messages, function(o){
                return o.content != "";
            })
        },
    },

    methods: {
        fetch_messages: function() {
            var params = {search: this.search_keyword};
            this.$http({url: this.messages_url, params: params, method: 'GET'})
                .then(resp => {
                    this.messages = resp.data.results;
                    this.status="success";
                })
                .catch(err => {
                    this.status='error';
                });
        },
        message_kind_label: function(kind) {
            return this.kind_label[kind];
        },
        goto_view_message: function(message_pk){
            this.$router.push({name:'message-view', params: {pk: this.user.id, message_pk: message_pk}});
        },
    },

    filters :{
        uppercase: function(v) {
            return v.toUpperCase();
        }
    },

    created() {
        this.$store.dispatch("theme/set_theme_blue");
    },
    mounted() {
        this.fetch_messages();
    },
}
</script>

<style lang="scss">
.messages-list-view {
    input.text-input::placeholder {
        font-size: 17px;
    }
    .message-card{
        display: grid;
        height: 100px;
        grid-template-columns: [column1-start] 1fr 9fr [column2-end];
        grid-template-rows: 2fr 1fr 1fr;
        grid-row-gap: 0.75em;
        grid-column-gap: 1em;
        align-items: center;
        margin-bottom: 5%;
    }
    .image-alternate {
        /* width: fit-content; */
        padding: 5px 10px 5px 10px;
    }
    .sender-image {
        width: 40px;
        align-self: center;
        justify-self: center;
    }
    .unread-dot {
        width:10px;
        height: 10px;
        position: absolute;
        margin-top: 15px;
        margin-left: -3px;
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
        text-align: left;
    }
    .text-input {
        border: none;
        font-family: "Montserrat";
        // font-size: 13pt;
        background-color: whitesmoke;
    }
    .search-box {
        margin: 5%;
        background: url($milife-search-icon) no-repeat scroll 93% 50%;
        background-color: whitesmoke;
    }
    .fc-lightblack {
        color: lighten(black, 40%)
    }
    .fw-700 {
        font-weight: 700;
    }
}
</style>
