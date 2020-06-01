<template>
<div id="profile-picture-update-view">
  <PictureSelector
    v-model="image"
    v-on:cropping="cropping=true"
    v-on:cropped="cropping=false"
    :circle_stencil="true"
    > </PictureSelector>

  <button class="milife-button btn_profileUpload-save" v-on:click="update_picture()"> Save</button>
</div>
</template>

<script>

import PictureSelector from "@/components/PictureSelector.vue";
export default {
    name: "ProfilePictureUpdateView",
    props: ['fobj_user', ],
    components: {PictureSelector, },
    data(){
        return {
            image: "",
            status: "",
            error_message: "",
            errors: {},
        };
    },
    computed: {
        upsert_url: function() {
            return process.env.VUE_APP_BASE_URL+'/api/me/';
            
        },
        user: function() {
            var fobj_user = Object.assign({}, this.fobj_user);
            return fobj_user;
        },
        
    },
    methods: {
        update_picture: function(){
            let formData = new FormData();

            if(this.image && typeof this.image != 'string'){
                formData.append('image', this.image, 'something.png');
            };

            return new Promise((resolve, reject) => {
                this.$http({url: this.upsert_url, data:formData, method: 'PATCH'})
                    .then(resp => {
                        this.status='success';
                        this.error_message="";
                        this.errors={};
                        //this.$router.push({name: "", params: {pk: resp.data.id} });
                        this.$router.go(-1);
                        resolve(resp);
                    })
                    .catch(err => {
                        this.status='error';
                        this.errors=err.data;
                        reject(err);
                    });
            });
        }
    },
    mounted(){},
    created(){},
}
</script>

<style>
    #profile-picture-update-view{
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        height: 100vmin;
    }
    .btn_profileUpload-save {
        width: 240px;
        margin: 30px 0px;
        line-height: 1;
    }
</style>
