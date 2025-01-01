'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FunctionFilterProps {
	functions: string[];
	selectedFunctions: string[];
	onSelectionChange: (functions: string[]) => void;
}

export function FunctionFilter({
	functions,
	selectedFunctions,
	onSelectionChange,
}: FunctionFilterProps) {
	const [open, setOpen] = React.useState(false);

	const toggleFunction = (functionName: string) => {
		if (selectedFunctions.includes(functionName)) {
			onSelectionChange(
				selectedFunctions.filter((fn) => fn !== functionName)
			);
		} else {
			onSelectionChange([...selectedFunctions, functionName]);
		}
	};

	const clearSelection = () => {
		onSelectionChange([]);
		setOpen(false);
	};

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
		>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-[240px] justify-between'
				>
					{selectedFunctions.length === 0 ? (
						<span className='text-muted-foreground'>
							Filter by function
						</span>
					) : (
						<span className='truncate'>
							{selectedFunctions.length} selected
						</span>
					)}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[240px] p-0'>
				<Command>
					<CommandInput placeholder='Search functions...' />
					<CommandList>
						<CommandEmpty>No functions found.</CommandEmpty>
						<CommandGroup>
							{functions.map((fn) => (
								<CommandItem
									key={fn}
									value={fn}
									onSelect={() => toggleFunction(fn)}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											selectedFunctions.includes(fn)
												? 'opacity-100'
												: 'opacity-0'
										)}
									/>
									{fn}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
				{selectedFunctions.length > 0 && (
					<div className='border-t p-2'>
						<div className='flex flex-wrap gap-1'>
							{selectedFunctions.map((fn) => (
								<Badge
									key={fn}
									variant='secondary'
									className='gap-1'
								>
									{fn}
									<X
										className='h-3 w-3 cursor-pointer hover:text-muted-foreground/80'
										onClick={(e) => {
											e.stopPropagation();
											toggleFunction(fn);
										}}
									/>
								</Badge>
							))}
						</div>
						<Button
							variant='ghost'
							size='sm'
							className='mt-2 w-full'
							onClick={clearSelection}
						>
							Clear all
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
