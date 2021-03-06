
const routes = [
  {
    path: '/',
    component: () => import('layouts/BLALayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'programming', component: () => import('pages/ProgrammingIndex.vue') },
      { path: 'mathIndex', component: () => import('pages/math/Index.vue') },
      { path: 'mathNaturalNumbers', component: () => import('pages/math/NaturalNumbers.vue') },
      { path: 'physicsIndex', component: () => import('pages/physics/Index.vue') },
      { path: 'homogeneousTranslation', component: () => import('pages/physics/newtonianMechanics/HomogeneousTranslation.vue') },
      { path: 'velocity', component: () => import('pages/physics/newtonianMechanics/CurrentVelocity.vue') },
      { path: 'acceleration', component: () => import('pages/physics/newtonianMechanics/Acceleration.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
