import { ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import ProfileHeader from '../ProfileHeader.vue'
import fixtures from '../../utils/test/fixtures'
import { createTestingPinia } from '@pinia/testing'
import { router } from '../../router'
import { userStore } from '../../store/user'

const mockFollowProfile = jest.fn()
jest.mock('src/composable/useProfile', () => ({
  useProfile: () => ({
    profile: fixtures.profile,
    following: ref(false),
    followProfile: jest.fn(),
  }),
}))

beforeEach(async () => {
  await router.push('/@Gerome')
  mockFollowProfile.mockReset()
})

describe('ProfileHeader', () => {
  test('logged user profile', async () => {
    const wrapper = mount(ProfileHeader, {
      global: {
        plugins: [router, createTestingPinia()],
      },
    })
    const store = userStore()
    store.user = { ...fixtures.user, ...fixtures.profile }

    await flushPromises()
    expect(wrapper.html()).toContain('Gerome')
    expect(wrapper.html()).toContain('Edit Profile Settings')
  })

  test('follow other user when logged', async () => {
    const wrapper = mount(ProfileHeader, {
      global: {
        plugins: [router, createTestingPinia()],
      },
    })
    const store = userStore()
    store.user = fixtures.user
    await flushPromises()

    wrapper.find('.action-btn').trigger('click')
    expect(wrapper.html()).toContain('Follow Gerome')
    expect(mockFollowProfile).toBeCalledTimes(1)
  })

  test('follow without logged in', async () => {
    const wrapper = mount(ProfileHeader, {
      global: {
        plugins: [router, createTestingPinia()],
      },
    })
    await flushPromises()

    wrapper.find('.action-btn').trigger('click')
    expect(wrapper.html()).toContain('Follow Gerome')
    expect(mockFollowProfile).toBeCalledTimes(0)
  })
})