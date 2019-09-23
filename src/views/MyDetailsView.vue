<template>
<div class="my-details-view" v-if="status">
  <div class="cropped-profile-photo">
    <img class="profile-photo" :src="profile.image" v-if="profile.image!=null"/>
    <img class="profile-photo" src="@/assets/images/placeholder-profile.png" v-else/>
  </div>
  <div class="name fw-600 fn-18 pd-10"> {{profile.first_name}} {{profile.last_name}} </div>

  <div
    class="edit-link-container fn-12"
    v-on:click="goto_edit_details"> Edit details <div class="arr-right fc-green"> </div>
  </div>
  <div >
    <section
      class="message-button margin-zero-auto bg-green br-50 mt-20 flex-spacebetween "
      v-on:click="goto_message_list">
      <span class="ml-20 mt-15"> Messages </span>
      <span class="mr-20 mt-15 v-if='messages_count!=0">
        <MessageCountBubble> {{messages_count}} </MessageCountBubble>
      </span>
    </section>
  </div>

  <div class="bg-white width-100 mt-20 pt-10 pb-10">
    <div class="flex-center">
      <div class="pd-10">
        <label for="height" class="fc-magenta">HEIGHT</label>
        <div class="fc-black" v-if="profile.height_cm">
          <template v-if="height_unit=='metric'">

            {{Math.round(profile.height_cm)}} cm
          </template>
          <template v-else>
            {{get_feet_from_cm(profile.height_cm/30.48)}}' {{Math.round(get_inches_from_cm(profile.height_cm))}}"
          </template>
        </div>

      </div>

      <div class="pd-10">
        <label for="dob" class="fc-magenta">DATE OF BIRTH</label>
        <div class="fc-black"> {{display_date(profile.date_of_birth)}}</div>
      </div>

      <div class="pd-10">
        <label for="mobile" class="fc-magenta">MOBILE</label>
        <div class="fc-black"> {{profile.number}}</div>
      </div>

      <div class="pd-10">
        <label for="eMAIL" class="fc-magenta">EMAIL</label>
        <div class="fc-black"> {{profile.email}}</div>
      </div>
    </div>
    <div class="width-80 button-grid bg-white margin-zero-auto mt-20">
      <div class="bg-green fc-white  height-100 br-10 flex-center"
           v-on:click="goto_view_documents"
           > View Docs </div>
      <div class="bg-green fc-white  height-100 br-10 flex-center"
           v-on:click="goto_view_programmes"
           > Programme </div>
      <div class="bg-green fc-white  height-100 br-10 flex-center"
           v-on:click="goto_view_mealplan"
           > Meal Plan </div>
      <div class="bg-green fc-white  height-100 br-10 flex-center"
           v-on:click="goto_view_progress_reports"
           > Your Reports </div>
    </div>




  </div>
</div>
<div v-else>
  <template v-if="error"> error </template>
  <template v-else> loading ... </template>
</div>
</template>

<script>
import MessageCountBubble from '@/components/MessageCountBubble.vue';
import moment from "moment";
export default {
    name: "MyDetailsView",
    components: {MessageCountBubble, },
    data() {
        return {
            profile_api_status: 'initial',
            messages_api_status: 'initial',
            messages_count: 0,
            profile: {},
            feet2cm: 30.48,
            inch2cm: 2.54,
        }
    },
    computed: {
        status: function(){
            return this.profile_api_status =='success' && this.messages_api_status=='success';
        },
        error: function(){
            return this.profile_api_status =='error' || this.messages_api_status=='error';
        },
        is_admin: function(){
            return store.getters['auth/is_staff']
        },
        user: function() {
            var user = Object.assign({}, this.$store.state.auth.user);
            return user;
        },
    },
    
    methods: {
        display_date: function(date_str){
            return moment(date_str).format("DD MMMM");
        },
        get_feet_from_cm: function(cm){
            console.log('get_feet_from_cm', cm, Math.floor(cm / this.feet2cm));
            return Math.floor(cm / this.feet2cm);
            
        },

        get_inches_from_cm: function(cm){
            var value = cm / this.inch2cm;
            if (cm >= this.feet2cm){
                value = cm / this.feet2cm % 1 * 12;
            }
            console.log('get_inches_from_cm', cm, Math.floor(cm / this.feet2cm));
            return Math.round(value*100)/100
        },            
        goto_message_list: function() {
            this.$router.push({name: 'message-list-view'});
        },
        goto_edit_details: function(){
            this.$router.push({name: 'my-profile'});
        },
        goto_view_documents: function(){
            this.$router.push({name: 'my-documents'});
        },
        goto_view_programmes: function(){
            this.$router.push({name: 'my-programmes'});
        },
        goto_view_mealplan: function(){
            this.$router.push({name: 'my-mealplan-summary'});
        },
        goto_view_progress_reports: function(){
            this.$router.push({name: 'self-progress-chart'});
        },
        fetch_profile: function(){
            this.$http({url: process.env.VUE_APP_BASE_URL + '/api/me', method: 'GET' })
                .then(resp => {
                    this.profile = resp.data;
                    this.profile_api_status='success';
                    //resolve(resp);
                })
                .catch(err => {
                    this.profile_api_status="error";
                    //reject(err);
                });
        },
        fetch_messages: function(){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + '/message';
            var params = {
                read: false,
                deleted: false,
                content_isempty: false,

            }
            this.$http({url: url, params:params, method: 'GET'})
                .then(resp => {
                    this.messages_count = resp.data.count;
                    this.messages_api_status = 'success';
                })
                .catch(err => {
                    this.messages_api_status='error';
                });

        }
    },
    created(){
        this.$store.dispatch("theme/set_theme_blue");
        this.fetch_profile();
        this.fetch_messages();
    },
}
</script>


<style lang="scss">
.my-details-view {
    img.profile-photo {
        display: inline;
        height: auto;
        /* max-width: 200px; */
        max-height: 150px;
        width: auto;
        margin: auto;
        border-radius: 50%;
    }
    section.message-button {
        width: 80%;
        height: 60px;
        div {
            margin: 0 auto;
            span {
                padding-left: 30px;
            }
        }
    }
    .button-grid {
        display: grid;
        grid: 50px 50px / 1fr 1fr;
        grid-gap: 10px;
        align-items: center;

    }

}
</style>
