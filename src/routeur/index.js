import {createRouter, createWebHistory} from "vue-router";
import identification from "@/components/Controler/connexion/identification.vue";
import Facturier from "@/components/Vue/Facturier.vue";
import modifierProfil from "@/components/Vue/modifierProfil.vue";
import transmettreDocumentOPCO from "@/components/Vue/transmettreDocumentOPCO.vue";


const routes = [
    {
        name:'connexion',
        path:'/',
        component: identification
    },
    {
        name:'facturier',
        path:'/facturierUI',
        component: Facturier
    },
    {
        name:'modifierProfil',
        path:'/modifierProfil',
        component: modifierProfil
    },
    {
        name:'transmettreDossier',
        path:'/transmettreDossier',
        component: transmettreDocumentOPCO
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});


export default router;