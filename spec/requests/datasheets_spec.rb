require 'rails_helper'
require 'devise'

RSpec.describe '/datasheets', type: :request do
  describe '(Not logged in Admin) Should be redirect to sign_path' do
    before do
      @admin_user = create(:admin_user)
      @item = create(:item, organization: create(:organization))
    end

    it 'Redirect to Login URL' do
      get new_admin_item_datasheet_path(@item)
      assert_redirected_to new_user_session_url
    end
  end

  describe '(Logged Admin) GET Routes ' do
    before do
      @admin_user = create(:admin_user)
      @organization = create(:organization, manager: @admin_user)
      @item = create(:item, organization: @organization)

      sign_in @admin_user
    end

    describe 'GET /index' do
      it 'renders a successful response' do
        get admin_item_datasheets_path(@item)
        expect(response).to be_successful
      end
    end

    describe 'GET /new' do
      it 'renders a successful response' do
        get new_admin_item_datasheet_path(@item)
        expect(response).to be_successful
      end
    end

    describe 'GET /show' do
      it 'renders a successful response' do
        datasheet = create(:datasheet, item: @item)

        get admin_datasheet_path(datasheet)
        expect(response).to be_successful
      end
    end
  end

  describe '(Logged Admin) POST Routes' do
    before do
      @admin_user = create(:admin_user)
      @organization = create(:organization, manager: @admin_user)
      @item = create(:item, organization: @organization)

      sign_in @admin_user
    end

    describe 'POST /create' do
      context 'with valid parameters' do
        it 'creates and redirect to the new Datasheet' do
          expect {
            post admin_item_datasheets_path(@item.id), params: {
              datasheet: {
                name: 'Datasheet Name',
                item_id: @item.id,
                status: true
              }
            }
          }.to change(Datasheet, :count).by(1)

          expect(response).to redirect_to(admin_datasheet_path(Datasheet.last.id))
        end
      end

      context 'with invalid parameters' do
        it 'does not create a new Datasheet' do
          expect {
            post admin_item_datasheets_path(@item.id), params: {
              datasheet: {
                name: '',
                item_id: @item.id,
                status: true
              }
            }
          }.to change(Datasheet, :count).by(0)
        end

        it "renders a response with 422 status (i.e. to display the 'new' template)" do
          post admin_item_datasheets_path(@item.id), params: {
            datasheet: {
              name: '',
              item_id: '',
              status: true
            }
          }
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end

    describe 'DELETE /destroy' do
      before do
        @admin_user = create(:admin_user)
        @organization = create(:organization, manager: @admin_user)
        @item = create(:item, organization: @organization)

        sign_in @admin_user
      end

      it 'destroys the requested Datasheet' do
        datasheet = create(:datasheet, item: @item)

        assert_difference 'Datasheet.count', -1 do
          delete admin_datasheet_path(datasheet)
        end
      end

      it 'redirects to the menu list' do
        datasheet = create(:datasheet, item: @item)

        assert_difference 'Datasheet.count', -1 do
          delete admin_datasheet_path(datasheet)
        end

        expect(response).to redirect_to(admin_item_path(@item))
      end
    end
  end
end