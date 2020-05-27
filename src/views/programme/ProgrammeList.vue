<template>
<div id="programme-list-container">
  <SelectedUserDisplay
    v-if="fobj_user"
    class="middle-column"
    :fobj_user="fobj_user">
  </SelectedUserDisplay>
  <div v-for="programme in programmes"
       class="programme-item middle-column"
       >
    <div class ="top-half">
      <h2>  {{programme.name}} </h2>
      <div class="align-left mt-15"> Start <strong>{{programme.start_date | moment('DD/MM/YYYY')}}</strong></div>
      <div class="align-right mt-15"> End <strong>{{programme.end_date | moment('DD/MM/YYYY')}}</strong> </div>
    </div>

    <div class="bottom-border mt-10">

      <span class="active ml-20" v-if="programme.active">Active</span>
      <span class="inactive ml-20" v-else>Completed</span>
      <span class="mr-15 clickable" v-on:click="goto_programme_detail(programme.id)">
        See details
        <img class="ml-10" src="@/assets/images/next-arrow.svg" />
      </span>

    </div>

  </div>

  <div
    v-if="is_admin"
    class="button middle-column mt-20"
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
            const route_name = this.is_admin ? 'programme-detail' : 'my-programme-detail';
            this.$router.push(
                {
                    name: route_name,
                    params:{programme_pk: programme_pk, pk: this.user_pk}
                }
            )

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
            font-size: 10pt;
            margin-left: 0;
            padding-left: 30px;
            float: left;

            strong {
                font-weight: 600;
            }
        }

        .align-right{
            font-size: 10pt;
            margin-right: 0;
            padding-right: 30px;
            float: right;

            strong {
                font-weight: 600;
            }
        }

        div {
            color: white;
        }
        h2 {
            margin: 5px;
            font-size: 16pt;
        }
        div.top-half {
            height: 60px;
            padding-top: 1em;
            padding-bottom: 1em;
        }
        .bottom-border{
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
            background-color: darken($milife-blue, 5%);
            border-radius: 0px 0px 10px 10px;
            padding-top: 0.5em;
            padding-bottom: 0.5em;
            font-weight: 500;

            span {
                display: flex;
            }
        }

        .active {
            color: $milife-green;
        }

        .inactive {
            color: $milife-magenta;
        }
    }

    .button {
        font-size: 12pt;
        color: white;
        padding: 20px;
    }

    .mr-15 {
        margin-right: 15px;
    }

    .clickable {
        cursor: pointer;
    }

    .clickable:hover {
        filter: invert(25%);
    }
}
</style>
