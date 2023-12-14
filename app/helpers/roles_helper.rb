module RolesHelper
  private
    def permissions_options
      Role.permissions.map { |key, value| [key.humanize, key] }
    end
end
