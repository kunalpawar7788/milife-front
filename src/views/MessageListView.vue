<template>
<div class="messages-list-view">
  <input
    class="text-input"
    v-model="search_keyword"
    placeholder="Start typing to search"
    v-on:keyup="fetch_messages">
  <div v-if="status=='success'">
    <div
      class="message-card bg-white margin-10 fc-black width-90 br-10 pd-10"
      v-for="message in display_messages"
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
        <div class="fn-16 fc-black ta-left">
          {{message.sender.first_name}} {{message.sender.last_name}}
        </div>
        <span class="fn-11 fc-grey ta-left">
          {{ message.modified_at | moment("Do MMM YY")}}
        </span>
      </div>
      <div class="grid-span-both-columns float-left fc-bluegrey fw-600">{{message_kind_label(message.kind)}}</div>
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
                "checkin-commentry": "Checkin Commentry",
                "weekly-commentry": "Weekly Commentry",
                misc: "Miscellaneous",
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
                console.log( 'userid', this.$store.state.auth.user.id);
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
                    console.log(err);
                });
        },
        message_kind_label: function(kind) {
            return this.kind_label[kind];
        },
        goto_view_message: function(message_pk){
            this.$router.push({name:'message-view', params: {pk: this.user.id, message_pk: message_pk}});
        },
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
    .message-card{
        display: grid;
        height: 100px;
        grid-template-columns: [column1-start] 1fr 9fr [column2-end];
        grid-template-rows: 2fr 1fr 1fr;
        grid-row-gap: 5px;
        grid-column-gap: 10px;
        align-items: center;
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
    }
}
</style>
