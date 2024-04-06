class Permission < ClassyEnum::Base
end

class Permission::None < Permission
end

class Permission::Read < Permission
end

class Permission::Update < Permission
end

class Permission::Manage < Permission
end
