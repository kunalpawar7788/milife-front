<template>
<div id="programme-list-container">
  <SelectedUserDisplay class="middle-column" :fobj_user="fobj_user"> </SelectedUserDisplay>
  <div v-for="programme in programmes"
       class="programme-item middle-column"
       v-on:click="goto_programme_detail(programme.id)"
       >
    <div class ="top-half">
      <h2>  {{programme.name}} </h2>
      <div class="align-left"> Start: <strong>{{programme.start_date}}</strong></div>
      <div class="align-right"> End: <strong>{{programme.end_date}}</strong> </div>
    </div>

    <div class="bottom-border">

      Status: {{programme.active?'Active': 'Inactive'}}

    </div>

  </div>

  <div
    v-if="is_admin"
    class="button middle-column"
    v-on:click="goto_add_programme()"> Add Programme
  </div>
</div>

</template>

<script>
import SelectedUserDisplay from '@/components/SelectedUserDisplay';
export default {
    name: 'ProgrammeList',
    props: ['fobj_user', ],
    components: {SelectedUserDisplay},

    data() {
        return {
            //user_pk: this.$route.params.pk,
            programmes: [],
            status: '',
        }
    },
    computed: {
        user_pk: function(){
            if (this.$route.params.pk) {
                return this.$route.params.pk;
            }
            else {
                return this.$store.state.auth.user.id;
            }
        },
        is_admin: function() {
            return this.$store.state.auth.user.is_staff;
        },

    },
    methods: {
        fetch_programmes: function(){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk + "/programmes";
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.status='success';
                    this.error_message="";
                    this.errors={};
                    this.programmes = resp.data.results;
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },
        goto_add_programme: function(){
            this.$router.push({name: "programme-add"});
        },
        goto_programme_detail: function(programme_pk){
            this.$router.push({name: "programme-detail", params:{programme_pk: programme_pk, pk: this.fobj_user.id}});
        }
    },
    mounted() {
        this.fetch_programmes();
        this.$store.dispatch("theme/set_theme_white");
    },

}
</script>

<style lang="scss">
#programme-list-container{
    display: grid;
    background-color: white;
    grid-template-columns: 1fr 10fr 1fr;

    .middle-column {
        grid-column: 2;
    }

    .programme-item {
        background-color: $milife-blue;
        border-radius: 10px;
        margin: 10px 0px;
        padding: 0;
        color: white;

        .align-left{
            margin-left: 0;
            padding-left: 20px;
            float: left;
        }

        .align-right{
            margin-right: 0;
            padding-right: 20px;
            float: right;
        }

        div {
            color: white;
        }
        h2 {
            margin: 5px;

        }
        div.top-half {
            height: 60px;
        }
        .bottom-border{
            margin-top: 5px;
            background-color: darken($milife-blue, 10%);
            border: 1px solid green;
        }
    }

}
</style>
