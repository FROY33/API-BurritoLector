import { Controller, Get, Query, UseGuards, Request, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../role.enum';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('affinity/:id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.USER)
    getAffinity(@Request() req: any, @Param('id', ParseIntPipe) otherUserId: number) {
        const currentUserId = req.user.id;
        return this.usersService.getAffinity(currentUserId, otherUserId);
    }
}
