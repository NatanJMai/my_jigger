module AdminHelper
  private
    def is_admin?
      if current_user.nil?
        flash[:alert] = "You don't have access permission!"

        redirect_to sign_in_url
      end
    end
end
