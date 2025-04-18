import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Icons} from "@/components/icons";

const placeholderImage = "https://picsum.photos/128/128";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-background">
      {/* Header */}
      <header className="flex w-full justify-between items-center mb-8">
        <div className="flex items-center">
          <Icons.shield className="mr-2 h-6 w-6 text-primary"/>
          <span className="text-lg font-semibold">BASEPASS</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ml-2">
              Administrator <Icons.chevronDown className="ml-2 h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content */}
      <div className="container max-w-3xl">
        <section className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">SECURE DIGITAL VISITOR VERIFICATION</h1>
          <Button className="w-full md:w-auto">SCAN CODE</Button>
        </section>

        <Card className="mb-8">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">VISITOR DETAILS</h2>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={placeholderImage} alt="Visitor Image"/>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p>Name: John Doe</p>
                <p>ID: 123456789</p>
                <p>Purpose: Meeting</p>
                <p>Valid Until: April 30, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="mb-8">
          <h2 className="font-semibold mb-4">MANUAL CODE ENTRY</h2>
          <div className="flex space-x-2">
            <Input type="text" placeholder="Enter code" className="flex-grow"/>
            <Button>SUBMIT</Button>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-semibold mb-4">OFFLINE FUNCTIONALITY</h2>
          <Card>
            <CardContent className="p-4">
              Code verification and data caching available when offline
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
